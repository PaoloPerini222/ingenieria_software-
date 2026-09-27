// Preguntas de los temas que se agregaron o corrigieron al verificar el apunte contra la
// Planificación Anual 2026 y la bibliografía oficial (Jacobson cap. 6-7, Bentley cap. 1,
// Pressman cap. 2 y 30, Arlow cap. 1 y 9, Guía de Scrum 2020, Essential Kanban).
// Se suman a los exámenes por unidad y a los generales del mismo nivel.
// Formato: { u: unidad, t: tema del apunte, q: enunciado, o: [[texto, 1 correcta / 0 incorrecta], ...], e: explicación }
(function () {
  const extra = {

    // ======================= FÁCIL =======================
    facil: [
      // ---- Unidad I ----
      { u: 1, t: '1.11', q: 'Según Whitten y Bentley, ¿quiénes son involucrados en un sistema de información?',
        o: [['Los propietarios del sistema', 1], ['Los usuarios del sistema', 1], ['Los constructores del sistema', 1], ['Los compiladores del sistema', 0]],
        e: 'Los involucrados son propietarios, usuarios, diseñadores, constructores, analistas y proveedores de servicio externo.' },
      { u: 1, t: '1.13', q: 'Sobre el PROCESO DE NEGOCIO, ¿qué es correcto?',
        o: [['Es un conjunto de tareas lógicamente relacionadas para obtener un resultado de negocio', 1], ['Tiene un cliente bien definido que recibe el resultado', 1], ['Es un programa de computadora', 0], ['Nunca cruza los límites entre áreas de la organización', 0]],
        e: 'Definición de Pressman. Los procesos de negocio cruzan los límites organizativos.' },
      { u: 1, t: '1.6', q: '¿Qué término propone Pressman para describir mejor los problemas del software, en lugar de “crisis”?',
        o: [['Crisis terminal', 0], ['Bala de plata', 0], ['Mitología', 0], ['Deterioro físico', 0]],
        e: 'Ninguna: Pressman propone hablar de una “aflicción crónica”, algo que causa pena y que reaparece con frecuencia, continuando indefinidamente.' },

      // ---- Unidad II ----
      { u: 2, t: '2.3', q: 'Sobre el VÍNCULO entre objetos, ¿qué es correcto?',
        o: [['Es una conexión semántica entre dos objetos que permite enviar mensajes de uno a otro', 1], ['Es una relación entre clases', 0], ['Si hay un vínculo entre dos objetos, debe existir una conexión semántica entre sus clases', 1], ['Un vínculo es un tipo de clase', 0]],
        e: 'El vínculo relaciona objetos; la asociación relaciona clases (describe un conjunto de vínculos).' },
      { u: 2, t: '2.8', q: '¿Cuáles son los bloques de construcción de UML?',
        o: [['Elementos', 1], ['Relaciones', 1], ['Diagramas', 1], ['Compiladores', 0]],
        e: 'UML se compone de tres bloques de construcción: elementos, relaciones y diagramas.' },
      { u: 2, t: '2.3', q: '¿Qué muestra un DIAGRAMA DE OBJETOS?',
        o: [['Objetos y sus vínculos en un punto en el tiempo', 1], ['Solo las clases y sus relaciones en general', 0], ['El orden de las fases del proyecto', 0], ['Los requisitos no funcionales', 0]],
        e: 'Es como una instantánea de parte de un sistema orientado a objetos en ejecución.' },

      // ---- Unidad III ----
      { u: 3, t: '3.6', q: '¿Cuáles son las cuatro “P” del desarrollo de software según Jacobson?',
        o: [['Personas', 1], ['Proyecto', 1], ['Producto', 1], ['Presupuesto', 0]],
        e: 'Personas, Proyecto, Producto y Proceso (y además, las herramientas que automatizan el proceso).' },
      { u: 3, t: '3.19', q: '¿Quién desarrolló el Modelo de Capacidad de Madurez (CMM)?',
        o: [['La OTAN', 0], ['La IEEE', 0], ['Toyota', 0], ['El OMG', 0]],
        e: 'Ninguna: lo desarrolló el Software Engineering Institute (SEI).' },
      { u: 3, t: '3.15', q: 'Según la Guía de Scrum 2020, ¿cuáles son valores de Scrum?',
        o: [['Enfoque', 1], ['Apertura', 1], ['Coraje', 1], ['Velocidad', 0]],
        e: 'Los cinco valores son compromiso, enfoque, apertura, respeto y coraje.' },

      // ---- Unidad IV ----
      { u: 4, t: '4.2', q: '¿Cuáles son pasos del flujo de trabajo de requisitos según Jacobson?',
        o: [['Enumerar los requisitos candidatos', 1], ['Comprender el contexto del sistema', 1], ['Capturar requisitos funcionales', 1], ['Compilar el sistema', 0]],
        e: 'Los cuatro pasos: enumerar candidatos, comprender el contexto, capturar funcionales y capturar no funcionales.' },
      { u: 4, t: '4.4', q: '¿Cuáles son trabajadores del flujo de trabajo de requisitos?',
        o: [['Analista del sistema', 1], ['Especificador de casos de uso', 1], ['Ingeniero de componentes', 0], ['Ingeniero de pruebas de integración', 0]],
        e: 'Son cuatro: analista del sistema, especificador de casos de uso, diseñador de interfaces de usuario y arquitecto.' },
      { u: 4, t: '4.5', q: '¿Qué trabajador PRIORIZA los casos de uso?',
        o: [['El arquitecto', 1], ['El diseñador de interfaces de usuario', 0], ['El especificador de casos de uso', 0], ['El ingeniero de componentes', 0]],
        e: 'El arquitecto identifica los casos de uso arquitectónicamente significativos.' },
      { u: 4, t: '4.5', q: '¿Qué trabajador DETALLA un caso de uso?',
        o: [['El especificador de casos de uso', 1], ['El arquitecto', 0], ['El diseñador de interfaces de usuario', 0], ['El ingeniero de pruebas', 0]],
        e: 'El analista no puede detallar todos los casos de uso solo: lo hacen los especificadores, cerca de los usuarios reales.' },
      { u: 4, t: '4.3', q: '¿Cuáles son artefactos del flujo de requisitos (Jacobson, capítulo 7)?',
        o: [['Modelo de casos de uso', 1], ['Glosario', 1], ['Prototipo de interfaz de usuario', 1], ['Modelo de despliegue', 0]],
        e: 'También actor, caso de uso y descripción de la arquitectura (vista del modelo de casos de uso). El modelo de despliegue es del diseño.' },
      { u: 4, t: '4.2', q: '¿En qué fases se hace fundamentalmente el trabajo de requisitos?',
        o: [['En construcción y transición', 0], ['Solo en transición', 0], ['Solo al final del proyecto', 0], ['Únicamente en construcción', 0]],
        e: 'Ninguna: se hace fundamentalmente durante el INICIO y la ELABORACIÓN.' },
      { u: 4, t: '4.3', q: 'La lista de características se usa para...',
        o: [['La planificación del trabajo', 1], ['Reemplazar al modelo de casos de uso', 0], ['Describir la arquitectura', 0], ['Documentar el código', 0]],
        e: 'Según Jacobson, se utiliza solo para la planificación del trabajo.' },
      { u: 4, t: '4.3', q: '¿Qué estados puede tener una característica de la lista de características?',
        o: [['Propuesto', 1], ['Aprobado', 1], ['Validado', 1], ['Compilado', 0]],
        e: 'Los estados son propuesto, aprobado, incluido o validado.' }
    ],

    // ======================= MEDIO =======================
    medio: [
      // ---- Unidad I ----
      { u: 1, t: '1.11', q: 'Sobre los involucrados de un sistema de información, ¿qué es correcto?',
        o: [['Los propietarios pagan por el sistema y establecen la visión y las prioridades', 1], ['Los usuarios definen los requerimientos de negocios y las expectativas', 1], ['Los diseñadores construyen, implantan y mantienen el sistema', 0], ['Los constructores traducen los requerimientos en una solución técnica', 0]],
        e: 'Está cruzado: los diseñadores traducen los requerimientos en una solución técnica; los constructores construyen, implantan y mantienen.' },
      { u: 1, t: '1.11', q: '¿Qué habilidades debe tener un analista de sistemas según Bentley?',
        o: [['Buenas habilidades de comunicación interpersonal', 1], ['Carácter y ética', 1], ['Flexibilidad y adaptabilidad', 1], ['Evitar conocer los procesos del negocio', 0]],
        e: 'También necesita conocimiento general de procesos y terminología de negocios.' },
      { u: 1, t: '1.13', q: 'Las REGLAS DE NEGOCIO...',
        o: [['Especifican políticas y procedimientos del negocio que el sistema debe obedecer', 1], ['Son requisitos de hardware', 0], ['Son los diagramas BPMN', 0], ['Son los casos de prueba', 0]],
        e: 'Por ejemplo, cómo se calculan los cargos de envío o las condiciones para otorgar un crédito.' },
      { u: 1, t: '1.14', q: 'Sobre la reingeniería de procesos de negocio (RPN), ¿qué es correcto?',
        o: [['Busca cambios radicales en el proceso de negocio para lograr un avance significativo', 1], ['Es iterativa y evolutiva', 1], ['Cuanto más alto el nivel de la jerarquía al que se aplica, mayor es el riesgo', 1], ['Es una “bala de plata” que siempre funciona', 0]],
        e: 'Pressman advierte que no es una bala de plata: funciona si la aplican personas motivadas y formadas.' },
      { u: 1, t: '1.14', q: '¿Cuáles son actividades del modelo de RPN?',
        o: [['Definición del negocio', 1], ['Identificación de procesos', 1], ['Reestructuración de datos', 0], ['Ingeniería directa', 0]],
        e: 'Reestructuración de datos e ingeniería directa son actividades de la reingeniería del SOFTWARE, no de la RPN.' },
      { u: 1, t: '1.14', q: 'Sobre la mejora continua, ¿qué es correcto según Pressman?',
        o: [['Se asocia a la Gestión Total de la Calidad', 1], ['Kaizen es un sistema de mejora continua del proceso', 1], ['Se hace una sola vez al inicio del proyecto', 0], ['Reemplaza al proceso de software', 0]],
        e: 'La mejora continua alimenta el compromiso organizacional con la calidad.' },

      // ---- Unidad II ----
      { u: 2, t: '2.8', q: '¿Cuáles son mecanismos comunes de UML?',
        o: [['Especificaciones', 1], ['Adornos', 1], ['Divisiones comunes', 1], ['Herencia múltiple', 0]],
        e: 'Los cuatro mecanismos comunes: especificaciones, adornos, divisiones comunes y mecanismos de extensibilidad.' },
      { u: 2, t: '2.8', q: '¿Cuáles son mecanismos de EXTENSIBILIDAD de UML?',
        o: [['Restricciones', 1], ['Estereotipos', 1], ['Paquetes', 0], ['Notas', 0]],
        e: 'Restricciones, estereotipos y valores etiquetados. El paquete es un elemento de agrupación y la nota, de anotación.' },
      { u: 2, t: '2.8', q: 'Sobre los elementos de UML, ¿qué es correcto?',
        o: [['Los elementos estructurales son los “nombres” del modelo', 1], ['Los elementos de comportamiento son los “verbos” del modelo', 1], ['El único elemento de agrupación es el paquete', 1], ['La nota es un elemento estructural', 0]],
        e: 'La nota es el único elemento de anotación.' },

      // ---- Unidad III ----
      { u: 3, t: '3.6', q: 'Sobre las cuatro “P” de Jacobson, ¿qué es correcto?',
        o: [['El resultado de un proyecto es una versión de un producto', 1], ['El producto incluye modelos, código fuente, ejecutables y documentación', 1], ['El proceso es el organigrama de la empresa', 0], ['Las herramientas son las personas del proyecto', 0]],
        e: 'El proceso es una plantilla para crear proyectos; las herramientas son el software que automatiza sus actividades.' },
      { u: 3, t: '3.10', q: 'Sobre el desarrollo iterativo e incremental del PU, ¿qué es correcto?',
        o: [['Las iteraciones son pasos en el flujo de trabajo; los incrementos, crecimiento del producto', 1], ['Cada iteración trata un grupo de casos de uso y los riesgos más importantes', 1], ['Iterativo significa que no hay planificación', 0], ['Cada iteración recorre un único flujo de trabajo', 0]],
        e: 'Cada iteración recorre los flujos de requisitos, análisis, diseño, implementación y prueba.' },
      { u: 3, t: '3.19', q: 'Sobre los niveles de madurez del CMM, ¿qué es correcto?',
        o: [['Nivel 2: Repetible', 1], ['Nivel 4: Gestionado', 1], ['Nivel 1: Optimización', 0], ['Nivel 3: Caótico', 0]],
        e: 'Los cinco niveles: 1 Inicial, 2 Repetible, 3 Definido, 4 Gestionado, 5 Optimización.' },
      { u: 3, t: '3.17', q: '¿Cuáles son los principios directores de Kanban?',
        o: [['Sostenibilidad', 1], ['Orientación al servicio', 1], ['Supervivencia', 1], ['Velocidad', 0]],
        e: 'Sostenibilidad mira hacia adentro, orientación al servicio hacia el cliente y supervivencia hacia el futuro.' },
      { u: 3, t: '3.7', q: 'Sobre el Proceso Unificado como concepto, ¿qué es correcto?',
        o: [['Es un marco de trabajo genérico que se especializa', 1], ['Está basado en componentes', 1], ['Utiliza UML para preparar los esquemas del sistema', 1], ['Es una receta rígida igual para todos los proyectos', 0]],
        e: 'Puede especializarse para distintos sistemas, áreas de aplicación, organizaciones y tamaños de proyecto.' },

      // ---- Unidad IV ----
      { u: 4, t: '4.4', q: 'Sobre el ANALISTA DEL SISTEMA en el flujo de requisitos, ¿qué es correcto?',
        o: [['Encuentra los actores y los casos de uso', 1], ['Es responsable del glosario', 1], ['Estructura el modelo de casos de uso', 1], ['Construye los prototipos de interfaz', 0]],
        e: 'Los prototipos de interfaz los construye el diseñador de interfaces de usuario.' },
      { u: 4, t: '4.4', q: 'Sobre el DISEÑADOR DE INTERFACES DE USUARIO, ¿qué es correcto?',
        o: [['Da forma visual a las interfaces de usuario', 1], ['Construye prototipos de interfaz para algunos casos de uso', 1], ['Prioriza los casos de uso', 0], ['Detalla todos los casos de uso', 0]],
        e: 'Priorizar es tarea del arquitecto; detallar, de los especificadores.' },
      { u: 4, t: '4.4', q: 'Sobre el ARQUITECTO en el flujo de requisitos, ¿qué es correcto?',
        o: [['Describe la vista de la arquitectura del modelo de casos de uso', 1], ['Prioriza los casos de uso arquitectónicamente significativos', 1], ['Es responsable del glosario', 0], ['Detalla todos los casos de uso', 0]],
        e: 'El glosario es responsabilidad del analista del sistema.' },
      { u: 4, t: '4.5', q: '¿Qué pasos incluye la actividad “Encontrar actores y casos de uso”?',
        o: [['Encontrar los actores', 1], ['Encontrar los casos de uso', 1], ['Describir brevemente cada caso de uso', 1], ['Implementar cada caso de uso', 0]],
        e: 'También describir el modelo de casos de uso completo, incluyendo el glosario.' },
      { u: 4, t: '4.5', q: 'En la actividad “Estructurar el modelo de casos de uso”, se extraen...',
        o: [['Descripciones de funcionalidad generales y compartidas', 1], ['Descripciones opcionales o adicionales', 1], ['Las clases de diseño', 0], ['Los componentes ejecutables', 0]],
        e: 'Se usan generalizaciones, inclusiones y extensiones para hacer el modelo más comprensible.' },
      { u: 4, t: '4.3', q: 'Sobre el modelo del negocio y el modelo del dominio, ¿qué es correcto?',
        o: [['El modelo del negocio es un supraconjunto del modelo del dominio', 1], ['El modelo del negocio describe los procesos de negocio', 1], ['El modelo del dominio describe solo procesos', 0], ['Son exactamente el mismo modelo', 0]],
        e: 'El modelo del dominio captura los objetos más importantes del contexto; el del negocio incluye además los procesos.' },
      { u: 4, t: '4.3', q: 'Sobre los REQUISITOS ADICIONALES, ¿qué es correcto?',
        o: [['Son requisitos no funcionales genéricos que no se relacionan con un caso de uso concreto', 1], ['Los no funcionales específicos de un caso de uso se describen en ese caso de uso', 1], ['Son requisitos funcionales', 0], ['Reemplazan al modelo de casos de uso', 0]],
        e: 'Los requisitos no funcionales propios de un caso de uso van como requisitos especiales en su descripción.' },
      { u: 4, t: '4.5', q: 'Sobre las actividades del flujo de requisitos, ¿qué es correcto?',
        o: [['Deben ejecutarse en una secuencia estricta', 0], ['Cada actividad se ejecuta una sola vez', 0], ['Todas las realiza una única persona', 0], ['Prototipar la interfaz es tarea del arquitecto', 0]],
        e: 'Ninguna. No hay secuencia estricta, las actividades pueden retomarse muchas veces, las realizan distintos trabajadores y prototipar la interfaz es del diseñador de interfaces de usuario.' },
      { u: 4, t: '4.3', q: 'La DESCRIPCIÓN DE LA ARQUITECTURA (vista del modelo de casos de uso)...',
        o: [['Muestra los casos de uso arquitectónicamente significativos', 1], ['Muestra todos los casos de uso con el mismo peso', 0], ['La elabora el especificador de casos de uso', 0], ['Contiene el código fuente', 0]],
        e: 'La describe el arquitecto.' }
    ],

    // ======================= DIFÍCIL =======================
    dificil: [
      // ---- Unidad I ----
      { u: 1, t: '1.11', q: 'Sobre el papel del analista de sistemas, ¿qué es correcto?',
        o: [['Es un puente entre los involucrados no técnicos y los técnicos', 1], ['Para Bentley, “problema” incluye oportunidades de mejora aunque nadie se queje', 1], ['Es básicamente un solucionador de problemas', 1], ['Solo se enfoca en los aspectos técnicos', 0], ['Nunca puede desempeñar otro papel de involucrado', 0]],
        e: 'Entiende de negocios y de cómputo, y con frecuencia también juega otros papeles.' },
      { u: 1, t: '1.14', q: '¿Cuáles son actividades del modelo de proceso de reingeniería del SOFTWARE?',
        o: [['Análisis de inventario', 1], ['Ingeniería inversa', 1], ['Ingeniería directa', 1], ['Compilación cruzada', 0], ['Definición del negocio', 0]],
        e: 'Las seis son análisis de inventario, reestructuración de documentos, ingeniería inversa, reestructuración del código, reestructuración de datos e ingeniería directa. “Definición del negocio” es de la RPN.' },
      { u: 1, t: '1.14', q: 'Sobre la reingeniería del software, ¿qué es correcto según Pressman?',
        o: [['Describe el mantenimiento como un “iceberg”', 1], ['El mantenimiento puede superar el 60% de las inversiones de una organización de desarrollo', 1], ['La reestructuración del código es el tipo más común de reingeniería', 1], ['La ingeniería inversa construye un sistema nuevo desde cero', 0], ['Solo conviene hacerla si también se hace RPN', 0]],
        e: 'La ingeniería inversa recupera la información de diseño del software existente. Aunque se rechace la RPN, la reingeniería del software “es algo que debe hacerse”.' },

      // ---- Unidad II ----
      { u: 2, t: '2.8', q: 'Sobre la vista 4+1 de la arquitectura en UML, ¿qué es correcto?',
        o: [['La vista lógica muestra la funcionalidad y el vocabulario del sistema', 1], ['La vista de despliegue muestra topología, distribución e instalación', 1], ['La vista de casos de uso une a las otras cuatro', 1], ['La vista de procesos trata el ensamblaje y la gestión de la configuración', 0], ['UML es una metodología de desarrollo', 0]],
        e: 'El ensamblaje y la configuración son de la vista de implementación. UML es un lenguaje; la metodología que mejor lo complementa es el PU.' },

      // ---- Unidad III ----
      { u: 3, t: '3.10', q: '¿Por qué conviene un desarrollo iterativo e incremental según Jacobson?',
        o: [['Atenúa los riesgos', 1], ['Consigue una integración continua', 1], ['Permite un aprendizaje temprano', 1], ['Elimina la necesidad de una arquitectura', 0], ['Permite congelar los requisitos desde el inicio', 0]],
        e: 'También ayuda a obtener una arquitectura robusta y a gestionar requisitos cambiantes.' },
      { u: 3, t: '3.19', q: 'Sobre el CMM del SEI, ¿qué es correcto?',
        o: [['Cada nivel incluye las características del anterior', 1], ['En el nivel 4 el proceso y el producto se controlan cuantitativamente', 1], ['En el nivel 1 el éxito depende del esfuerzo individual', 1], ['El nivel 5 corresponde a un proceso caótico', 0], ['Lo desarrolló la OTAN', 0]],
        e: 'El nivel 5 es Optimización (mejora continua con retroalimentación cuantitativa). Lo desarrolló el SEI.' },
      { u: 3, t: '3.17', q: 'Sobre los principios y prácticas de Kanban, ¿qué es correcto?',
        o: [['“Empezar con lo que estés haciendo ahora” es un principio de gestión del cambio', 1], ['“Limitar el trabajo en progreso” es una práctica general', 1], ['“Gestionar el trabajo, dejando que la gente se auto-organice” es un principio de despliegue de servicios', 1], ['“Visualizar” es un principio director', 0], ['“Supervivencia” es una práctica general', 0]],
        e: 'Visualizar es una práctica general; supervivencia es un principio director.' },

      // ---- Unidad IV ----
      { u: 4, t: '4.6', q: 'Sobre el conjunto de requisitos (Jacobson), ¿qué es correcto?',
        o: [['Reemplaza a la especificación de requisitos tradicional', 1], ['El modelo de casos de uso y los requisitos adicionales definen una especificación tradicional', 1], ['Cambia constantemente, aunque los cambios disminuyen al avanzar la construcción', 1], ['Queda fijo al terminar la fase de inicio', 0], ['Lo define solo el cliente', 0]],
        e: 'Cada iteración refleja algún cambio en el conjunto de requisitos.' },
      { u: 4, t: '4.3', q: 'Sobre los valores de planificación de una característica, ¿qué es correcto?',
        o: [['Prioridad: crítico, importante o secundario', 1], ['Riesgo: crítico, significativo u ordinario', 1], ['Estado: propuesto, aprobado, incluido o validado', 1], ['Coste estimado en líneas de código', 0], ['Prioridad: alta, media o baja', 0]],
        e: 'El coste se estima en tipos de recursos y horas-persona.' },
      { u: 4, t: '4.5', q: 'Según Jacobson, sobre cómo fluyen las actividades del flujo de requisitos, ¿qué es correcto?',
        o: [['El analista empieza encontrando actores y casos de uso a partir de la lista de características y el modelo del dominio o del negocio', 1], ['En paralelo con los especificadores, los diseñadores de interfaz sugieren interfaces para cada actor', 1], ['Una actividad puede retomarse muchas veces', 1], ['El arquitecto detalla todos los casos de uso', 0], ['Estructurar el modelo es siempre la primera actividad', 0]],
        e: 'Estructurar el modelo suele venir después, cuando el analista reestructura con generalizaciones.' },
      { u: 4, t: '4.4', q: 'Sobre los trabajadores del flujo de requisitos, ¿qué es correcto?',
        o: [['El ingeniero de casos de uso detalla los casos de uso', 0], ['El analista del sistema diseña las interfaces de usuario', 0], ['El especificador de casos de uso prioriza los casos de uso', 0], ['Un trabajador siempre es una sola persona', 0], ['El arquitecto construye los prototipos de interfaz', 0]],
        e: 'Ninguna. Detalla el especificador de casos de uso; diseña las interfaces el diseñador de interfaces de usuario; prioriza el arquitecto; un trabajador es un rol que puede cubrir un grupo de personas.' },
      { u: 4, t: '4.5', q: 'En una iteración, el arquitecto decide qué casos de uso desarrollar; tres personas describen en detalle “Pagar factura”, “Enviar factura” y “Confirmar pedido”; otra dibuja las pantallas. ¿Qué es correcto?',
        o: [['El arquitecto está realizando la actividad “Priorizar casos de uso”', 1], ['Las tres personas actúan como especificadores de casos de uso', 1], ['Quien dibuja las pantallas está realizando “Estructurar el modelo de casos de uso”', 0], ['Una misma persona no puede especificar varios casos de uso', 0], ['Las tres personas deben ser analistas del sistema', 0]],
        e: 'Dibujar las pantallas corresponde a “Prototipar la interfaz de usuario” (diseñador de interfaces de usuario).' }
    ]
  };

  const target = window.EXAM_UNIT_EXTRA = window.EXAM_UNIT_EXTRA || {};
  for (const level in extra) target[level] = (target[level] || []).concat(extra[level]);
})();
