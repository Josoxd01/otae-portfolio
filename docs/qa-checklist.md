# QA checklist OTAE

Checklist manual para validar la web publica, el panel admin, Firebase, fallbacks, rutas dinamicas y build final del proyecto OTAE.

## Preparacion

- [x] Confirmar que `.env.local` existe localmente y no fue modificado.
- [x] Confirmar que Firebase apunta al proyecto correcto.
- [x] Confirmar que `npm install` / `npm ci` ya fue ejecutado.
- [x] Levantar el proyecto con `npm run dev`.
- [x] Abrir el sitio en una ventana normal y otra sin extensiones si Brave/Adblock bloquea Firebase.
- [x] Revisar consola del navegador y terminal durante las pruebas.

## Web publica - navegacion general

- [x] Navbar carga en Home.
- [x] Navbar muestra el logo fijo `/brand/otae-logo.png`.
- [x] Si el logo falla, aparece fallback textual `OTAE`.
- [x] Navbar incluye `Proyectos`, `Estudio`, `Blogs` y `Contacto` en el orden esperado.
- [x] Footer aparece en todas las paginas publicas.
- [x] Footer incluye link a `Blogs` apuntando a `/blog`.
- [x] No aparece `/dev/styles` en ninguna navegacion publica.
- [x] `/dev/styles` responde 404 y no muestra el playground.

## Home

- [x] Home carga sin errores visibles.
- [x] Hero carga correctamente.
- [x] Carrusel de proyectos destacados muestra proyectos activos/destacados.
- [x] Boton siguiente del carrusel cambia de proyecto.
- [x] Boton anterior del carrusel cambia de proyecto.
- [x] Si un proyecto no tiene categoria principal, muestra fallback correcto.
- [x] Areas de especializacion muestran categorias activas.
- [x] Seccion `Ultimo blog` aparece debajo de Areas de especializacion.
- [x] Ultimo blog toma el blog publicado mas reciente.
- [x] Imagen del ultimo blog es clickeable. 
- [x] Link `Leer mas` del ultimo blog abre `/blog/[slug]`.
- [x] Fondo oscuro del ultimo blog coincide con el esquema definido.
- [x] Seccion `Acerca de OTAE` sigue apareciendo debajo del blog.
- [x] CTA `Tienes un proyecto en mente` usa el mismo negro profesional definido.
- [x] Footer oscuro usa el mismo negro profesional.

## Proyectos - listado

- [x] `/proyectos` carga sin errores.
- [x] Listado muestra proyectos activos desde Firestore cuando esta disponible.
- [x] Si Firestore falla, el listado conserva mocks/fallback sin romper.
- [x] Filtros por categoria funcionan.
- [x] Paginacion funciona.
- [x] Imagenes de proyectos cargan correctamente.
- [x] Proyecto sin portada no rompe el layout.
- [x] Proyecto nuevo creado desde admin aparece si `isActive` es `true`.

## Proyectos - detalle

- [x] Proyecto antiguo/mock abre por `/proyectos/[slug]`.
- [x] Proyecto nuevo de Firestore abre por `/proyectos/pruebinia` sin 404.
- [x] Si Firestore falla en servidor, la pagina no queda bloqueada antes del cliente. 
- [x] Proyecto inactivo no se muestra como publico.
- [x] Slug inexistente devuelve 404 o estado no encontrado segun corresponda.
- [x] Portada se muestra si existe.
- [x] Si no hay portada, aparece fallback visual y no rompe.
- [x] Descripcion, ubicacion, anio y area se muestran cuando existen.
- [x] Galeria visible se muestra.
- [x] Planos/PDF visibles se muestran.
- [x] Media oculta no aparece en publico.<!-- Ojo  eliminar -->
- [x] Link `Volver a proyectos` funciona.

## Estudio

- [x] `/estudio` carga sin errores.
- [x] Perfil del estudio carga desde Firestore cuando esta disponible.
- [x] Si Firestore falla, se conserva fallback local.
- [x] Hero/imagen institucional carga.
- [x] Texto de historia, mision, vision o contenido equivalente aparece.
- [x] Equipo activo se muestra.
- [x] Miembros inactivos no aparecen.
- [x] Datos de contacto del estudio siguen visibles donde corresponde.
- [x] Logo del navbar no depende de `studioProfile.logoMedia`.

## Contacto

- [x] `/contacto` carga sin errores.
- [x] Email, telefono, WhatsApp, redes, ubicacion u horarios se muestran si existen.
- [x] Canales inactivos no se muestran.
- [x] Links externos abren correctamente.
- [x] No se perdieron `contactChannels` de la web publica.

## Blog - listado

- [x] `/blog` carga sin errores.
- [x] La pagina usa blogs publicados desde Firestore cuando esta disponible.
- [x] Si Firestore falla, usa mocks/fallback sin romper.
- [x] No aparece titulo grande superior innecesario.
- [x] Articulo principal muestra el blog publicado mas reciente.
- [x] Articulo principal muestra imagen, fecha, titulo, subtitulo y extracto.
- [x] `Leer mas` esta integrado al resumen.
- [x] Imagen principal del articulo es clickeable.
- [x] Grid inferior excluye el articulo principal.
- [x] Cards muestran imagen, fecha, titulo, subtitulo y categorias.
- [x] Hover desktop en imagen muestra overlay con extracto y `Leer mas`.
- [x] En mobile no depende del hover para entender la card.
- [x] Imagenes mock/locales no estan rotas.

## Blog - detalle

- [x] Blog antiguo/mock abre por `/blog/[slug]`.
- [x] Blog creado desde admin abre por `/blog/[slug]` sin 404.
- [x] Blog publicado se muestra.
- [x] Blog `draft` u `hidden` no se muestra como publico.
- [x] Slug inexistente devuelve 404 o estado no encontrado segun corresponda.
- [x] Encabezado inicia con titulo, subtitulo y fecha.
- [x] No se muestran categorias arriba del titulo.
- [x] Imagen principal carga si existe.
- [x] Si no hay imagen principal, no rompe el layout.
- [x] Contenido se divide en parrafos correctamente.
- [x] Secciones de proyectos relacionados aparecen por categoria.
- [x] Categorias relacionadas se muestran centradas.
- [x] Texto `Proyectos relacionados` queda alineado a la izquierda.
- [x] Layout relacionado desktop usa proporcion 50% / 25% / 25%.
- [x] Hover en imagen de proyecto relacionado muestra descripcion y `Leer mas`.
- [x] Mobile apila proyectos relacionados en una columna.
- [x] Link `Volver a Blogs` funciona.

## Admin - login y shell

- [x] `/admin/login` muestra formulario.
- [x] Credenciales invalidas muestran error.
- [x] Credenciales validas entran al admin.
- [x] Sesion protegida redirige a login si no hay usuario.
- [x] Boton cerrar sesion funciona.
- [x] Topbar admin muestra logo/marca correctamente.
- [x] Link `Ver sitio` funciona.
- [x] Menu admin muestra Inicio, Proyectos, Categorias, Blogs, Estudio y Equipo.

## Admin - dashboard

- [x] `/admin` carga despues de autenticar.
- [x] Cards son completamente clickeables.
- [x] Cards muestran iconos coherentes.
- [x] Cards muestran contadores de Proyectos, Categorias, Blogs y Equipo.
- [x] Card Contacto ya no aparece.
- [x] Grid se ve equilibrado con 4/5 modulos segun viewport.
- [x] Hover/focus de cards funciona.

## Admin - proyectos

- [x] `/admin/projects` lista proyectos.
- [x] Crear proyecto guarda titulo, slug automatico, resumen, descripcion y metadata.
- [x] Editar proyecto conserva/actualiza datos correctamente.
- [ ] Slug se genera correctamente al crear.
- [x] Activar/desactivar proyecto funciona.
- [x] Proyecto activo aparece en publico.
- [x] Proyecto inactivo no aparece en publico.
- [x] Marcar destacado afecta Home/carrusel cuando corresponde.
- [x] Seleccion multiple de categorias funciona.
- [x] Especializacion principal se selecciona con dropdown custom.
- [x] Subir portada acepta JPG, PNG o WebP validos.
- [ ] Subir portada rechaza formatos o tamanios no permitidos.<!-- no tenemos nada de esto -->
- [x] Subir galeria funciona.
- [x] Subir plano acepta imagen/PDF permitido.
- [x] Ocultar/mostrar media funciona.
- [x] Reordenar media funciona.
- [x] Eliminar media abre modal propio, no `window.confirm`.
- [] Eliminar media quita el documento de media.<!-- Mmm no sigue en firestoreage -->
- [x] Reordenar proyectos guarda `sortOrder`.
- [x] Eliminar proyecto abre modal profesional.
- [x] Confirmar eliminar proyecto borra documento Firestore.
- [ ] Confirmar eliminar proyecto borra media/portada de Storage solo si tienen `storagePath`.<!-- No borra galeria creo que solo borra portada e intuyo que tampoco borra planos cuando se elimina el proyecto  -->
- [x] Eliminar proyecto no borra categorias asociadas.
- [x] Tras eliminar proyecto, desaparece del listado.

## Admin - categorias

- [x] `/admin/categories` lista categorias.
- [x] Crear categoria genera slug y orden inicial.
- [ ] Editar categoria guarda nombre, descripcion, estado e imagen.
- [x] Subir/reemplazar imagen de categoria funciona.
- [x] Activar/desactivar categoria funciona.
- [x] Reordenar categorias guarda `sortOrder`.
- [x] Eliminar categoria abre modal profesional.
- [x] Si la categoria tiene proyectos asociados, la accion cambia a ocultar.
- [x] Si la categoria tiene blogs asociados, la accion cambia a ocultar.
- [x] Al ocultar categoria con relaciones, se guarda `isActive: false`.
- [x] Al ocultar categoria con relaciones, no se eliminan proyectos/blogs.
- [x] Si la categoria no tiene relaciones, se elimina fisicamente.
- [x] Al eliminar fisicamente categoria, se borra su imagen de Storage si `coverMedia.storagePath` existe.
- [x] Si la imagen de categoria es externa o no tiene `storagePath`, no intenta borrar Storage.
- [x] Tras eliminar categoria, desaparece del listado.
## Admin - blogs

- [ ] `/admin/blogs` lista blogs `draft`, `published` y `hidden`.
- [ ] Crear blog guarda titulo, subtitulo, contenido, categorias, estado y fecha.
- [ ] Slug se calcula automaticamente desde el titulo.
- [ ] Slug no se muestra como campo editable.
- [ ] Subtitulo ocupa una fila completa.
- [ ] Select de estado usa dropdown custom con opcion seleccionada en negro.
- [ ] Seleccion multiple de categorias usa categorias existentes.
- [ ] No se pueden crear categorias nuevas desde Blog.
- [ ] Subir portada de blog funciona.
- [ ] Publicar blog cambia `status` a `published`.
- [ ] Publicar asigna `publishedAt` si no existe.
- [ ] Ocultar blog cambia `status` a `hidden`.
- [ ] Blog publicado aparece en `/blog`.
- [ ] Blog oculto/draft no aparece en publico.
- [ ] Editar blog ya publicado actualiza la pagina publica.
- [ ] Eliminar blog abre modal profesional.
- [ ] Confirmar eliminar blog borra documento Firestore.
- [ ] Confirmar eliminar blog borra portada de Storage si `coverMedia.storagePath` existe.
- [ ] Si la portada es externa o no tiene `storagePath`, no intenta borrar Storage.
- [ ] Tras eliminar blog, desaparece del listado.

## Admin - equipo

- [ ] `/admin/team` lista miembros.
- [ ] Crear miembro guarda nombre, rol, bio y estado.
- [ ] Editar miembro actualiza datos.
- [ ] Subir/reemplazar foto funciona.
- [ ] Activar/desactivar miembro funciona.
- [ ] Miembro activo aparece en Estudio.
- [ ] Miembro inactivo no aparece en Estudio.
- [ ] Reordenar miembros guarda `sortOrder`.
- [ ] Eliminar miembro abre modal profesional.
- [ ] Eliminar miembro no usa `window.confirm`.
- [ ] Tras eliminar miembro, desaparece del listado.

## Admin - estudio

- [ ] `/admin/studio` carga datos del estudio.
- [ ] Guardar textos principales funciona.
- [ ] Guardar email, telefono, WhatsApp, redes, ubicacion y horarios funciona.
- [ ] Contacto sigue administrandose desde Estudio.
- [ ] Logo principal se muestra como recurso fijo/no editable.
- [ ] No aparece boton para subir/reemplazar logo.
- [ ] Guardar estudio no modifica `logoMedia`.
- [ ] Hero/about/media institucional editable sigue funcionando si aplica.

## Firebase y fallback

- [ ] Web publica intenta cargar Firestore cuando esta disponible.
- [ ] Si Firestore devuelve datos, reemplaza mocks.
- [ ] Si Firestore falla, mocks/fallback quedan visibles.
- [ ] No hay errores 403 en lecturas publicas esperadas.
- [ ] Rules desplegadas permiten lectura publica de `blogs` publicados/coleccion segun implementacion actual.
- [ ] Escrituras admin requieren usuario autenticado.
- [ ] No hay llamadas destructivas a Storage sin `storagePath`.
- [ ] Brave Shields/Adblock no bloquean `firestore.googleapis.com` durante QA.

## Responsive y visual

- [ ] Home mobile/tablet/desktop sin solapes.
- [ ] Proyectos mobile/tablet/desktop sin scroll horizontal.
- [ ] Detalle proyecto mobile/tablet/desktop con imagenes proporcionadas.
- [ ] Blog listado mobile/tablet/desktop se adapta correctamente.
- [ ] Blog detalle mobile/tablet/desktop se adapta correctamente.
- [ ] Admin listados son usables con scroll horizontal controlado.
- [ ] Modales se ven bien en mobile y desktop.
- [ ] Textos largos no se salen de botones, cards o tablas.

## CI y comandos locales

- [ ] `npm run lint` pasa.
- [ ] `npm run test` pasa.
- [ ] `npx tsc --noEmit --pretty false` pasa.
- [ ] `npm run build` pasa.
- [ ] Workflow `.github/workflows/ci.yml` existe.
- [ ] CI corre `npm ci`, lint si existe, test, typecheck y build.
- [ ] CI no requiere `.env.local`.
- [ ] CI usa variables dummy o Repository Variables/Secrets segun corresponda.

## GitHub / despliegue futuro

- [ ] Rama de trabajo actual esta limpia antes de merge.
- [ ] PR o merge a `master/main` dispara CI.
- [ ] No se configuro deploy automatico todavia.
- [ ] No se tocaron Firebase Hosting ni dominios.
- [ ] Evaluar Firebase App Hosting para deploy Next.js dinamico.
- [ ] Confirmar variables `NEXT_PUBLIC_FIREBASE_*` necesarias para entorno remoto.

## Pendiente para fase E2E

- [ ] Cubrir login admin con credenciales de entorno controlado.
- [ ] Cubrir CRUD completo de proyectos contra emuladores o entorno aislado.
- [ ] Cubrir CRUD completo de blogs contra emuladores o entorno aislado.
- [ ] Cubrir subidas y borrados de Storage con bucket de prueba.
- [ ] Cubrir drag & drop de proyectos, categorias, equipo y media.
- [ ] Cubrir rutas dinamicas creadas desde admin sin rebuild.
- [ ] Cubrir flujos de eliminacion fisica vs ocultamiento.
- [ ] Cubrir smoke visual responsive con navegador real.

## Validaciones de formularios - campos obligatorios

Checklist para validar que los formularios del panel admin bloqueen correctamente registros incompletos cuando van a mostrarse públicamente.

### Proyectos

- [x] No permitir guardar proyecto sin título.
- [x] No permitir guardar proyecto sin resumen.
- [x] No permitir activar proyecto sin descripción.
- [x] No permitir activar proyecto sin portada.
- [x] No permitir activar proyecto sin al menos una categoría.
- [x] No permitir activar proyecto si la especialización principal no pertenece a las categorías seleccionadas.
- [x] Si se eliminan todas las categorías, limpiar la especialización principal.
- [x] Si no hay especialización principal pero sí hay categorías, asignar o solicitar una categoría principal.
- [x] Confirmar que el slug se genera al crear y no es editable.
- [x] Confirmar que el ID no es editable.
- [x] Confirmar que ubicación, año, área y etapa sean recomendados, pero no bloqueantes.

### Categorías

- [x] No permitir guardar categoría sin nombre.
- [x] Confirmar que el slug se genera al crear y no es editable.
- [x] Confirmar que el ID no es editable.
- [x] Si la categoría está activa y aparece en Home/Áreas de especialización, exigir imagen principal.
- [x] Confirmar que la descripción sea recomendada, pero no bloqueante.
- [x] Revisar si `categoryGroup` debe mantenerse como valor interno no bloqueante.

### Blogs

- [x] No permitir guardar blog sin título.
- [x] No permitir guardar blog sin estado.
- [x] No permitir publicar blog sin contenido.
- [x] No permitir publicar blog sin imagen principal.
- [x] No permitir publicar blog sin al menos una categoría.
- [x] Si se cambia el estado a publicado y no existe fecha de publicación, asignar fecha actual.
- [x] Confirmar que blogs en `draft` o `hidden` puedan guardarse incompletos.
- [x] Confirmar que el slug se genera al crear y no es editable.
- [x] Confirmar que el ID no es editable.

### Estudio

- [ ] No permitir guardar perfil de estudio sin nombre.
- [ ] Confirmar que descripción general y email sean recomendados fuertes, pero no bloqueantes.
- [ ] Confirmar que teléfono, WhatsApp number, Instagram URL y dirección sean recomendados, pero no bloqueantes.
- [ ] Si existe WhatsApp number y no existe WhatsApp URL, generar automáticamente el enlace de WhatsApp.
- [ ] Confirmar que ciudad, país, ubicación alternativa, mapa, horarios y LinkedIn sean opcionales.
- [ ] Confirmar que el logotipo principal no sea editable si está definido como solo lectura.

### Equipo

- [ ] No permitir guardar miembro sin nombre.
- [ ] No permitir activar miembro sin foto.
- [ ] No permitir activar miembro sin rol/cargo.
- [ ] Confirmar que miembros inactivos puedan guardarse incompletos.
- [ ] Confirmar que biografía, email, Instagram y LinkedIn sean opcionales.
- [ ] Confirmar que el ID no es editable.

### Regla general

- [ ] Confirmar que registros inactivos, ocultos o en borrador puedan guardarse incompletos.
- [ ] Confirmar que registros activos o publicados exijan campos mínimos.
- [ ] Confirmar que los slugs se generen al crear y no se editen.
- [ ] Confirmar que los IDs nunca sean editables.
- [ ] Confirmar que las imágenes subidas guarden `storagePath`.
- [ ] Confirmar que al eliminar media con `storagePath`, se elimine Firestore y Storage.
