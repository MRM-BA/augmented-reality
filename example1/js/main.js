window.onload = function() {

		var canvas = document.createElement('canvas');
		canvas.width = 320;
		canvas.hight = 240;

		// Se crea objeto raster, el cual es un objeto dectector
		// Se utiliza para leer los datos de la imagen
		var raster = new NyARRgbRaster_Canvas2D(canvas);

		document.body.appendChild(canvas);

		// FLARParam es utilizado por FLARToolKit para establecer los parámetros de la cámara.
		// Aquí creamos un FLARParam para imágenes con 320x240 dimensiones en píxeles.
		var param = new FLARParam(320, 240);

		// FLARMultiIdMarkerDetector es un motor de marcado
		var detector = new FLARMultiIdMarkerDetector(param, 120);

		//permite hacer seguimiento de las marcas a traves de multiples frames
		detector.setContinueMode(true);


		param.copyCameraMatrix(display.camera.perspectiveMatrix, 10, 10000);

		var video = document.createElement('video');
		video.width = 320;
		video.hight = 240;

		var getUserMedia = function(t, onsucess, onerror) {
			//Pide al usuario permiso para usar un dispositivo multimedia como una cámara o micrófono. 
			//Si el usuario concede este permiso, 
			//el successCallback es invocado en la aplicación llamada con un objeto LocalMediaStream como argumento

			//A continuación se utiliza getUserMedia() con los prefijos del navegador
			if (navigator.getUserMedia) {
				return navigator.getUserMedia(t, onsuccess, onerror);
			} else if (navigator.webkitGetUserMedia) {
				return navigator.webkitGetUserMedia(t, onsuccess, onerror);
			} else if (navigator.mozGetUserMedia) {
				return navigator.mozGetUserMedia(t, onsuccess, onerror);
			} else if (navigator.msGetUserMedia) {
				return navigator.msGetUserMedia(t, onsuccess, onerror);
			} else {
				onerror(new Error("No getUserMedia implementation found."));
			}
		};

		var URL = window.URL || window.webkitURL;
		var createObjectURL = URL.createObjectURL || webkitURL.createObjectURL;
		console.log('createObjectURL', createObjectURL);

		if (!createObjectURL) {
			throw new Error("URL.createObjectURL not found.");
		}


		getUserMedia({
				'video': true
			},
			function(stream) {
				var url = createObjectURL(stream);
				video.src = url;
			},
			function(error) {
				alert("Couldn't access webcam.");
			}
		);

		//Dibuja la imagen en el elemento canvas del objeto ráster
		canvas.getContext('2d').drawImage(video, 0, 0, 320, 240);


		canvas.changed = true;

		// Ejecuta el detector en el objeto ráster. 
		// El detector devolverá el número de marcadores que encuentre en la imagen
		var markerCount = detector.detectMarkerLite(raster, threshold);

		// Create a NyARTransMatResult object for getting the marker translation matrices.
		var resultMat = new NyARTransMatResult();

		var markers = {};

		// Go through the detected markers and get their IDs and transformation matrices.
		for (var idx = 0; idx < markerCount; idx++) {
			// Get the ID marker data for the current marker.
			// ID markers are special kind of markers that encode a number.
			// The bytes for the number are in the ID marker data.
			var id = detector.getIdMarkerData(idx);

			// Read bytes from the id packet.
			var currId = -1;
			// This code handles only 32-bit numbers or shorter.
			if (id.packetLength <= 4) {
				currId = 0;
				for (var i = 0; i < id.packetLength; i++) {
					currId = (currId << 8) | id.getPacketData(i);
				}
			}

			// If this is a new id, let's start tracking it.
			if (markers[currId] == null) {
				markers[currId] = {};
			}
			// Get the transformation matrix for the detected marker.
			detector.getTransformMatrix(idx, resultMat);

			// Copy the result matrix into our marker tracker object.
			markers[currId].transform = Object.asCopy(resultMat);
		}


		//----------------------
		// I'm going to use a glMatrix-style matrix as an intermediary.
		// So the first step is to create a function to convert a glMatrix matrix into a Three.js Matrix4.
		THREE.Matrix4.prototype.setFromArray = function(m) {
			return this.set(
				m[0], m[4], m[8], m[12],
				m[1], m[5], m[9], m[13],
				m[2], m[6], m[10], m[14],
				m[3], m[7], m[11], m[15]
			);
		};

		// glMatrix matrices are flat arrays.
		var tmp = new Float32Array(16);

		// Create a camera and a marker root object for your Three.js scene.
		var camera = new THREE.Camera();
		scene.add(camera);

		var markerRoot = new THREE.Object3D();
		markerRoot.matrixAutoUpdate = false;

		// Add the marker models and suchlike into your marker root object.
		var cube = new THREE.Mesh(
			new THREE.CubeGeometry(100, 100, 100),
			new THREE.MeshBasicMaterial({
				color: 0xff00ff
			})
		);
		cube.position.z = -50;
		markerRoot.add(cube);

		// Add the marker root to your scene.
		scene.add(markerRoot);

		// Next we need to make the Three.js camera use the FLARParam matrix.
		param.copyCameraMatrix(tmp, 10, 10000);
		camera.projectionMatrix.setFromArray(tmp);


		// To display the video, first create a texture from it.
		var videoTex = new THREE.Texture(videoCanvas);

		// Then create a plane textured with the video.
		var plane = new THREE.Mesh(
			new THREE.PlaneGeometry(2, 2, 0),
			new THREE.MeshBasicMaterial({
				map: videoTex
			})
		);

		// The video plane shouldn't care about the z-buffer.
		plane.material.depthTest = false;
		plane.material.depthWrite = false;

		// Create a camera and a scene for the video plane and
		// add the camera and the video plane to the scene.
		var videoCam = new THREE.Camera();
		var videoScene = new THREE.Scene();
		videoScene.add(plane);
		videoScene.add(videoCam);

		

		// On every frame do the following:
		function tick() {
			// Draw the video frame to the canvas.
			videoCanvas.getContext('2d').drawImage(video, 0, 0);
			canvas.getContext('2d').drawImage(videoCanvas, 0, 0, canvas.width, canvas.height);

			// Tell JSARToolKit that the canvas has changed.
			canvas.changed = true;

			// Update the video texture.
			videoTex.needsUpdate = true;

			// Detect the markers in the video frame.
			var markerCount = detector.detectMarkerLite(raster, threshold);
			for (var i = 0; i < markerCount; i++) {
				// Get the marker matrix into the result matrix.
				detector.getTransformMatrix(i, resultMat);

				// Copy the marker matrix to the tmp matrix.
				copyMarkerMatrix(resultMat, tmp);

				// Copy the marker matrix over to your marker root object.
				markerRoot.matrix.setFromArray(tmp);
			}

			// Render the scene.
			renderer.autoClear = false;
			renderer.clear();
			renderer.render(videoScene, videoCam);
			renderer.render(scene, camera);
		}



	} //onload


function copyMarkerMatrix(arMat, glMat) {
	glMat[0] = arMat.m00;
	glMat[1] = -arMat.m10;
	glMat[2] = arMat.m20;
	glMat[3] = 0;
	glMat[4] = arMat.m01;
	glMat[5] = -arMat.m11;
	glMat[6] = arMat.m21;
	glMat[7] = 0;
	glMat[8] = -arMat.m02;
	glMat[9] = arMat.m12;
	glMat[10] = -arMat.m22;
	glMat[11] = 0;
	glMat[12] = arMat.m03;
	glMat[13] = -arMat.m13;
	glMat[14] = arMat.m23;
	glMat[15] = 1;
}