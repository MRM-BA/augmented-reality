## [WebRCT]

Web Real-Time Communication es un estándar abierto descrito por el W3C que pretende ofrecer audio y video en los navegadores
Es una API que está siendo elaborada por la World Wide Web Consortium (W3C) para permitir a las aplicaciones del navegador realizar llamadas de voz, chat de vídeo y uso compartido de archivos P2P sin plugins

### Habilitación WebRTC

+ [Chrome]
+ [Firefox]

## [WebGL]

Es una especificación estándar que está siendo desarrollada actualmente para mostrar gráficos en 3D en navegadores web. El WebGL permite mostrar gráficos en 3D acelerados por hardware (GPU) en páginas web, sin la necesidad de plug-ins en cualquier plataforma que soporte OpenGL 2.0 u OpenGL ES 2.0. Técnicamente es un API para javascript que permite usar la implementación nativa de OpenGL ES 2.0 que será incorporada en los navegadores

Las escenas WebGL se pueden crear sin necesidad de programación utilizando una herramienta de creación de contenidos, como Blender o con Autodesk Maya. Las escenas luego se exportan a WebGL. Esto fue posible por primera vez con Inka3D, un plugin de exportación WebGL para Maya. También hay servicios para publicar contenido en línea 3D interactivo utilizando WebGL como p3d.in y Sketchfab

## [three.js]

Es una librería bastante liviana y muy eficiente para generar y animar gráficos en 3D dentro del navegador, aprovechando las grandes novedades que nos ofrece HTML5 para la generación de contenidos multimedia. Aprovecha tanto las capacidades de HTML5 que es capaz de generar escenas 3D con WebGL, Canvas (2D) y SVG

## [JSARToolKit]

Es una biblioteca de realidad aumentada para JavaScript

JSARToolKit opera en elementos canvas. Debido a que necesita leer la imagen fuera del elemento canvas, es necesario que esta proceda del mismo origen que la página o que utilice la tecnología CORS para obtener una política con aproximadamente el mismo origen. En resumen, establece la propiedad crossOrigin del elemento de vídeo o imagen que quieras utilizar como textura para '' o 'anonymous'

Cuando transfieres un elemento canvas a JSARToolKit para analizarlo, JSARToolKit devuelve una lista de marcadores de realidad aumentada que se encuentran en la imagen y las matrices de transformación correspondientes. Para dibujar un objeto 3D en un marcador, transfiere la matriz de transformación a la librería de representación 3D que utilices, de manera que el objeto se transforme utilizando la matriz. A continuación, dibuja el fotograma de vídeo en la escena WebGL, dibuja el objeto en ella y lo tendrás preparado.

Para analizar un vídeo mediante JSARToolKit, dibuja el vídeo en un elemento canvas y, a continuación, transfiere el elemento canvas a JSARToolKit. Realiza esta acción para todos los fotogramas y obtendrás el tracking de realidad aumentada. JSARToolKit funciona con la suficiente rapidez en motores JavaScript modernos como para realizar este proceso en tiempo real incluso en fotogramas de vídeo de 640x480. Sin embargo, cuanto mayor sea el fotograma de vídeo, más tiempo se tardará en completar el proceso. Un tamaño adecuado para un fotograma de vídeo sería 320x240, pero si tienes previsto utilizar marcadores pequeños o varios marcadores, es preferible utilizar un tamaño de 640x480.

## [Canvas]

Es un elemento HTML que puede usarse para dibujar gráficos a través de scripting (normalmente JavaScript). Por ejemplo, puede emplearse para dibujar gráficos, hacer composición de fotos, crear animaciones e incluso procesamiento de vídeo en tiempo real

## BLOB (Binary Large Objects, objetos binarios grandes) 

Son elementos utilizados en las bases de datos para almacenar datos de gran tamaño que cambian de forma dinámica. No todos los Sistemas Gestores de Bases de Datos son compatibles con los BLOB.

Generalmente, estos datos son imágenes, archivos de sonido y otros objetos multimedia; a veces se almacenan como BLOB código de binarios.

## Sitios de referencias

1. http://www.html5rocks.com/es/tutorials/webgl/jsartoolkit_webrtc/
2. http://edumo.net/wp/realidad-aumentada-sobre-html5/
3. http://edumo.net/wp/
4. https://github.com/webrtc/samples 
5. http://www.justareflektor.com/ 



[WebRCT]: http://www.webrtc.org/ 
[three.js]: http://threejs.org/  
[WebGL]: https://get.webgl.org/ 
[JSARToolKit]: https://github.com/kig/JSARToolKit
[Canvas]: https://developer.mozilla.org/es/docs/Web/HTML/Canvas
[Chrome]: http://chrome://flags/
[Firefox]: https://developer.mozilla.org/es/docs/WebRTC/MediaStream_API


