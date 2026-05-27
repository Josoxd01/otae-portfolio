# Manual de usuario: mapa de campos del panel admin

Este documento resume los campos disponibles en el panel admin de OTAE y su efecto en el sitio público. Está basado en los formularios reales del admin y en los componentes públicos actuales.

## Proyectos

| Campo en admin | Tipo/control | Obligatorio | Qué hace | Dónde aparece | Observaciones |
|---|---|---|---|---|---|
| Título | Input texto | Sí | Define el nombre visible del proyecto. | Home, listado de proyectos, detalle de proyecto y proyectos relacionados en blogs. | Al crear un proyecto también genera el `slug`. Al editar, el `slug` se conserva. |
| Ubicación | Input texto | Recomendado | Indica la ciudad, zona o ubicación del proyecto. | Home en proyectos destacados, listado de proyectos, filtros de proyectos, detalle de proyecto y proyectos relacionados en blogs. | Si está vacío, no se muestra el dato ni aparece como filtro. |
| Resumen | Textarea | Sí | Texto corto para presentar el proyecto en tarjetas y listados. | Home en proyectos destacados, listado de proyectos y hover de proyectos relacionados en blogs. | No reemplaza la descripción completa del detalle. |
| Descripción | Textarea | Sí si el proyecto está activo | Texto largo principal del proyecto. | Detalle del proyecto. | Un proyecto activo no puede guardarse sin descripción. |
| Año | Input numérico | Recomendado | Registra el año del proyecto. | Home, listado de proyectos, filtro por año, detalle y proyectos relacionados en blogs. | Si está vacío, no se muestra ni aparece como filtro. |
| Área m² | Input numérico | Recomendado | Registra el área construida o intervenida. | Detalle del proyecto. | Se muestra como dato técnico con formato `m²`. |
| Etapa | Selector | Recomendado | Define el estado o etapa del proyecto. | Detalle del proyecto. | Opciones actuales: Conceptual, Diseño, En construcción, Completado. |
| Proyecto destacado | Toggle | Sí | Marca el proyecto para aparecer en el carrusel principal de Home. | Home, carrusel de proyectos destacados; también influye en el orden del listado de proyectos. | Solo se ve públicamente si el proyecto también está activo. |
| Proyecto activo | Toggle | Sí | Controla si el proyecto se publica en el sitio. | Home, listado, detalle y relaciones con blogs. | Para activar debe tener portada, descripción y al menos una categoría. |
| Categorías | Selector múltiple | Sí si el proyecto está activo | Relaciona el proyecto con áreas de especialización. | Home en áreas de especialización, filtros del listado, etiqueta de proyecto, detalle y proyectos relacionados en blogs. | Si se eliminan todas las categorías, se limpia la categoría principal. |
| Especialización principal | Selector | Sí si el proyecto está activo | Define la categoría principal del proyecto. | Home, listado y detalle como etiqueta principal. | Debe pertenecer a las categorías seleccionadas. Si deja de existir, se limpia o toma la primera categoría disponible. |
| Portada del proyecto | Upload de imagen | Sí si el proyecto está activo | Imagen principal del proyecto. | Home, listado de proyectos, detalle, áreas de especialización y proyectos relacionados en blogs. | No se puede activar un proyecto sin portada. |
| Galería: título opcional | Input texto | Opcional | Nombre visible para una imagen de galería. | Detalle del proyecto, sección Galería y visor de imagen. | Si queda vacío, la media puede mostrarse sin título. |
| Galería: visible | Toggle | Sí | Controla si una imagen de galería se publica. | Detalle del proyecto, sección Galería. | Si está oculto, no aparece públicamente. |
| Galería: subir imagen | Upload de imagen | Opcional | Agrega imágenes complementarias al proyecto. | Listado de proyectos como imagen secundaria y detalle en Galería. | Requiere guardar el proyecto antes de subir media. |
| Planos: título opcional | Input texto | Opcional | Nombre visible para un plano o archivo técnico. | Detalle del proyecto, sección Planos. | En PDF se muestra como título del archivo. |
| Planos: visible | Toggle | Sí | Controla si el plano o archivo aparece públicamente. | Detalle del proyecto, sección Planos. | Si está oculto, no aparece públicamente. |
| Planos: subir archivo | Upload de imagen o PDF | Opcional | Agrega planos o archivos técnicos. | Detalle del proyecto, sección Planos. | Requiere guardar el proyecto antes de subir media. |
| Orden | Reordenamiento desde listado | Sí | Define la posición editorial del proyecto. | Home, listado de proyectos y relaciones donde se ordenan proyectos. | No se edita dentro del formulario; se gestiona desde el listado admin. |
| Slug | Generado automáticamente | Sí | Construye la URL pública del proyecto. | URL `/proyectos/[slug]` y enlaces internos. | No es editable desde el formulario. No debe modificarse manualmente. |
| ID | Generado automáticamente | Sí | Identificador interno del registro. | Solo admin y relaciones internas. | No es editable. No debe modificarse. |

## Categorías

| Campo en admin | Tipo/control | Obligatorio | Qué hace | Dónde aparece | Observaciones |
|---|---|---|---|---|---|
| Nombre | Input texto | Sí | Define el nombre público del área o categoría. | Home en áreas de especialización, filtros de proyectos, etiquetas de proyectos, blogs y relacionados. | Al crear genera el `slug`; al editar, el `slug` se conserva. |
| Descripción | Textarea | Recomendado | Describe el área de especialización. | Home, sección Áreas de especialización. | Si está vacío, solo se muestra el nombre. |
| Activa | Toggle | Sí | Controla si la categoría aparece públicamente. | Home, filtros de proyectos, formularios de selección en proyectos/blogs y etiquetas públicas. | Si es `portfolio_area` y está activa, debe tener imagen principal. |
| Imagen de categoría | Upload de imagen | Sí si la categoría activa se muestra públicamente | Imagen principal del área de especialización. | Home, sección Áreas de especialización. | Para categorías nuevas, primero se debe escribir el nombre. |
| Orden | Reordenamiento desde listado | Sí | Define el orden editorial de las categorías. | Home y filtros de proyectos. | No se edita dentro del formulario; se gestiona desde el listado admin. |
| Grupo de categoría | Valor interno | No bloqueante | Clasifica la categoría internamente. | Indirectamente en Home si es `portfolio_area`. | El formulario actual fija `categoryGroup` como `portfolio_area`; no se edita en pantalla. |
| Slug | Generado automáticamente | Sí | Permite filtrar o enlazar categorías. | URL de filtros como `/proyectos?categoria=...` y relaciones internas. | No es editable desde el formulario. |
| ID | Generado automáticamente | Sí | Identificador interno del registro. | Solo admin y relaciones internas. | No es editable. No debe modificarse. |

## Blogs

| Campo en admin | Tipo/control | Obligatorio | Qué hace | Dónde aparece | Observaciones |
|---|---|---|---|---|---|
| Título | Input texto | Sí | Define el título de la publicación. | Home en Último blog, listado de blogs y detalle de blog. | Al crear genera el `slug`. Al editar, el `slug` se conserva. |
| Fecha de publicación | Input fecha | Sí si el blog está publicado | Define la fecha editorial visible. | Home en Último blog, listado y detalle de blog. | Si se cambia a Publicado y no existe fecha, se asigna automáticamente la fecha actual. |
| Subtítulo | Input texto | Opcional | Agrega un texto secundario bajo el título. | Home, listado y detalle de blog. | Si está vacío, no se muestra. |
| Contenido | Textarea | Sí si el blog está publicado | Cuerpo principal de la publicación. | Detalle de blog; también se usa para extractos en Home y listado. | Un borrador u oculto puede guardarse incompleto. |
| Imagen principal | Upload de imagen | Sí si el blog está publicado | Portada visual del blog. | Home en Último blog, listado y detalle de blog. | Para blogs nuevos, primero se debe escribir el título. |
| Estado | Selector | Sí | Define si el blog está en borrador, publicado u oculto. | Solo los blogs publicados aparecen en el sitio público. | No se permite publicar sin contenido, imagen principal y al menos una categoría. |
| Categorías | Selector múltiple | Sí si el blog está publicado | Relaciona el blog con áreas del portafolio. | Home en Último blog, listado, detalle y secciones de proyectos relacionados. | Reutiliza las categorías de proyectos; no crea categorías nuevas. |
| Slug | Generado automáticamente | Sí | Construye la URL pública del blog. | URL `/blog/[slug]` y enlaces internos. | No es editable desde el formulario. |
| ID | Generado automáticamente | Sí | Identificador interno del registro. | Solo admin y relaciones internas. | No es editable. No debe modificarse. |

## Estudio

| Campo en admin | Tipo/control | Obligatorio | Qué hace | Dónde aparece | Observaciones |
|---|---|---|---|---|---|
| Nombre del estudio | Input texto | Sí | Define el nombre base del perfil del estudio. | Contacto como respaldo del encabezado; también se usa como alt text de imágenes subidas. | Es el único campo bloqueante del perfil de estudio. |
| Eslogan | Input texto | Recomendado | Texto corto de posicionamiento. | Página Estudio. | Se usa como título si no existe otro título de hero en los datos. |
| Descripción general | Textarea | Recomendado fuerte | Describe el estudio. | Home en Acerca de OTAE, footer y página Estudio como respaldo de los párrafos. | Si está vacío, esas zonas pueden quedar sin texto descriptivo. |
| Misión | Textarea | Recomendado | Agrega un segundo texto institucional. | Home, sección Acerca de OTAE. | Si está vacío, no se muestra. |
| Etiqueta superior | Input texto | Opcional | Texto pequeño del hero de Estudio. | Página Estudio. | Si está vacío, se muestra el respaldo `Estudio`. |
| Párrafos acerca del estudio | Textarea | Recomendado | Relato principal del estudio en párrafos. | Página Estudio. | Se separa por líneas en blanco. Si está vacío, puede usar `aboutText` o `description` como respaldo. |
| Email | Input texto | Recomendado fuerte | Correo de contacto. | Página Contacto. | Se convierte en enlace `mailto:`. |
| Teléfono | Input texto | Recomendado | Teléfono de contacto. | Página Contacto. | Se convierte en enlace `tel:` quitando espacios. |
| WhatsApp number | Input texto | Recomendado | Número usado para WhatsApp. | Página Contacto y envío del formulario por WhatsApp. | Si no hay WhatsApp URL, se genera un link `wa.me` desde este número. |
| WhatsApp URL | Input texto | Recomendado | Link manual de WhatsApp. | Página Contacto y envío del formulario por WhatsApp. | Si existe, se usa como base y se agrega el mensaje prellenado. |
| Instagram handle | Input texto | Recomendado | Texto visible del Instagram. | Página Contacto. | Si está vacío, la fila de Instagram puede no mostrarse aunque exista URL. |
| Instagram URL | Input texto | Recomendado | Enlace a Instagram. | Página Contacto. | Se abre en nueva pestaña. |
| LinkedIn URL | Input texto | Opcional | Enlace a LinkedIn. | Página Contacto. | El texto visible usa el nombre legal o el nombre del estudio. |
| Dirección | Input texto | Recomendado | Dirección física o referencia. | Página Contacto. | Si no existe, se usa `location` como respaldo para la fila Ubicación. |
| Ciudad | Input texto | Opcional | Dato de ubicación. | Solo admin actualmente. | Está disponible en el perfil, pero no se renderiza directamente en las páginas revisadas. |
| País | Input texto | Opcional | Dato de ubicación. | Solo admin actualmente. | Está disponible en el perfil, pero no se renderiza directamente en las páginas revisadas. |
| Ubicación / location | Input texto | Opcional | Texto alternativo de ubicación. | Página Contacto como respaldo de Dirección. | Si hay Dirección, esta tiene prioridad en la fila Ubicación. |
| Location label | Input texto | Opcional | Encabezado del bloque de contacto. | Página Contacto. | Si está vacío, se muestra el nombre del estudio. |
| Map URL | Input texto | Opcional | Enlace externo al mapa. | Página Contacto. | Si existe, muestra el botón `Ver ubicación en mapa`. |
| Horarios: Label | Input texto en filas repetibles | Opcional | Nombre de una fila de horarios. | Página Contacto. | Ejemplo: `Lunes a viernes`. Filas vacías se descartan al guardar. |
| Horarios: Value | Input texto en filas repetibles | Opcional | Valor de una fila de horarios. | Página Contacto. | Ejemplo: `09:00 - 18:00`. |
| Imagen principal / oficina | Upload de imagen | Recomendado | Imagen hero de la página Estudio. | Página Estudio. | Si no existe, el hero puede quedar sin imagen. |
| Imagen acerca del estudio / equipo | Upload de imagen | Recomendado | Imagen secundaria del relato del estudio. | Página Estudio. | Si no existe, no se muestra esa imagen. |
| Logotipo principal | Solo lectura | No editable | Muestra el logo fijo del sistema. | Layout/sitio según configuración de marca. | No se puede modificar desde este formulario. |

## Equipo

| Campo en admin | Tipo/control | Obligatorio | Qué hace | Dónde aparece | Observaciones |
|---|---|---|---|---|---|
| Foto | Upload de imagen | Sí si el miembro está activo | Imagen pública del miembro del equipo. | Página Estudio, grilla de equipo y modal de perfil. | Para miembros nuevos, primero se debe escribir el nombre. |
| Nombre | Input texto | Sí | Nombre del miembro. | Página Estudio, grilla de equipo y modal de perfil. | Al crear genera el ID interno; al editar, el ID se conserva. |
| Rol / cargo | Input texto | Sí si el miembro está activo | Cargo o rol profesional. | Página Estudio, grilla de equipo. | No se permite activar un miembro sin cargo. |
| Biografía breve | Textarea | Opcional | Texto descriptivo del miembro. | No se muestra actualmente en los componentes públicos revisados. | Está guardado en el perfil para uso futuro o ampliación del modal. |
| Activo | Toggle | Sí | Controla si el miembro aparece en el sitio público. | Página Estudio. | No se permite activar sin cargo y fotografía. |
| LinkedIn | Input texto | Opcional | Enlace profesional del miembro. | No se muestra actualmente en los componentes públicos revisados. | Está disponible en datos, pero no se renderiza en la página Estudio actual. |
| Orden | Reordenamiento desde listado | Sí | Define la posición del miembro en el equipo. | Página Estudio. | No se edita dentro del formulario; se gestiona desde el listado admin. |
| ID | Generado automáticamente | Sí | Identificador interno del registro. | Solo admin y relaciones internas. | No es editable. No debe modificarse. |

## Notas generales

- Los registros inactivos, ocultos o en borrador pueden guardarse con información incompleta según el módulo.
- Los registros activos o publicados tienen validaciones mínimas para evitar contenido público incompleto.
- Los `slug` se generan automáticamente al crear registros y no son editables desde los formularios.
- Los `id` son internos y no deben modificarse.
- Las imágenes subidas desde el sistema guardan una ruta de Storage; las eliminaciones revisan esa ruta antes de intentar borrar archivos.
