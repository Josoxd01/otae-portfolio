# QA checklist OTAE

Checklist manual para validar la web publica, el panel admin, Firebase, fallbacks, rutas dinamicas y build final del proyecto OTAE.

## Preparacion

- [ ] Confirmar que `.env.local` existe localmente y no fue modificado.
- [ ] Confirmar que Firebase apunta al proyecto correcto.
- [ ] Confirmar que `npm install` / `npm ci` ya fue ejecutado.
- [ ] Levantar el proyecto con `npm run dev`.
- [ ] Abrir el sitio en una ventana normal y otra sin extensiones si Brave/Adblock bloquea Firebase.
- [ ] Revisar consola del navegador y terminal durante las pruebas.

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
- [ ] Si un proyecto no tiene categoria principal, muestra fallback correcto.
- [x] Areas de especializacion muestran categorias activas.
- [x] Seccion `Ultimo blog` aparece debajo de Areas de especializacion.
- [x] Ultimo blog toma el blog publicado mas reciente.
- [x] Imagen del ultimo blog es clickeable. 
- [x] Link `Leer mas` del ultimo blog abre `/blog/[slug]`.<!-- ojoo -->
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
- [ ] Proyecto sin portada no rompe el layout.
- [ ] Proyecto nuevo creado desde admin aparece si `isActive` es `true`.

## Proyectos - detalle

- [ ] Proyecto antiguo/mock abre por `/proyectos/[slug]`.
- [ ] Proyecto nuevo de Firestore abre por `/proyectos/pruebinia` sin 404.
- [ ] Si Firestore falla en servidor, la pagina no queda bloqueada antes del cliente.
- [ ] Proyecto inactivo no se muestra como publico.
- [ ] Slug inexistente devuelve 404 o estado no encontrado segun corresponda.
- [ ] Portada se muestra si existe.
- [ ] Si no hay portada, aparece fallback visual y no rompe.
- [ ] Descripcion, ubicacion, anio y area se muestran cuando existen.
- [ ] Galeria visible se muestra.
- [ ] Planos/PDF visibles se muestran.
- [ ] Media oculta no aparece en publico.
- [ ] Link `Volver a proyectos` funciona.

## Estudio

- [ ] `/estudio` carga sin errores.
- [ ] Perfil del estudio carga desde Firestore cuando esta disponible.
- [ ] Si Firestore falla, se conserva fallback local.
- [ ] Hero/imagen institucional carga.
- [ ] Texto de historia, mision, vision o contenido equivalente aparece.
- [ ] Equipo activo se muestra.
- [ ] Miembros inactivos no aparecen.
- [ ] Datos de contacto del estudio siguen visibles donde corresponde.
- [ ] Logo del navbar no depende de `studioProfile.logoMedia`.

## Contacto

- [ ] `/contacto` carga sin errores.
- [ ] Email, telefono, WhatsApp, redes, ubicacion u horarios se muestran si existen.
- [ ] Canales inactivos no se muestran.
- [ ] Links externos abren correctamente.
- [ ] No se perdieron `contactChannels` de la web publica.

## Blog - listado

- [ ] `/blog` carga sin errores.
- [ ] La pagina usa blogs publicados desde Firestore cuando esta disponible.
- [ ] Si Firestore falla, usa mocks/fallback sin romper.
- [ ] No aparece titulo grande superior innecesario.
- [ ] Articulo principal muestra el blog publicado mas reciente.
- [ ] Articulo principal muestra imagen, fecha, titulo, subtitulo y extracto.
- [ ] `Leer mas` esta integrado al resumen.
- [ ] Imagen principal del articulo es clickeable.
- [ ] Grid inferior excluye el articulo principal.
- [ ] Cards muestran imagen, fecha, titulo, subtitulo y categorias.
- [ ] Hover desktop en imagen muestra overlay con extracto y `Leer mas`.
- [ ] En mobile no depende del hover para entender la card.
- [ ] Imagenes mock/locales no estan rotas.

## Blog - detalle

- [ ] Blog antiguo/mock abre por `/blog/[slug]`.
- [ ] Blog creado desde admin abre por `/blog/[slug]` sin 404.
- [ ] Blog publicado se muestra.
- [ ] Blog `draft` u `hidden` no se muestra como publico.
- [ ] Slug inexistente devuelve 404 o estado no encontrado segun corresponda.
- [ ] Encabezado inicia con titulo, subtitulo y fecha.
- [ ] No se muestran categorias arriba del titulo.
- [ ] Imagen principal carga si existe.
- [ ] Si no hay imagen principal, no rompe el layout.
- [ ] Contenido se divide en parrafos correctamente.
- [ ] Secciones de proyectos relacionados aparecen por categoria.
- [ ] Categorias relacionadas se muestran centradas.
- [ ] Texto `Proyectos relacionados` queda alineado a la izquierda.
- [ ] Layout relacionado desktop usa proporcion 50% / 25% / 25%.
- [ ] Hover en imagen de proyecto relacionado muestra descripcion y `Leer mas`.
- [ ] Mobile apila proyectos relacionados en una columna.
- [ ] Link `Volver a Blogs` funciona.

## Admin - login y shell

- [ ] `/admin/login` muestra formulario.
- [ ] Credenciales invalidas muestran error.
- [ ] Credenciales validas entran al admin.
- [ ] Sesion protegida redirige a login si no hay usuario.
- [ ] Boton cerrar sesion funciona.
- [ ] Topbar admin muestra logo/marca correctamente.
- [ ] Link `Ver sitio` funciona.
- [ ] Menu admin muestra Inicio, Proyectos, Categorias, Blogs, Estudio y Equipo.

## Admin - dashboard

- [ ] `/admin` carga despues de autenticar.
- [ ] Cards son completamente clickeables.
- [ ] Cards muestran iconos coherentes.
- [ ] Cards muestran contadores de Proyectos, Categorias, Blogs y Equipo.
- [ ] Card Contacto ya no aparece.
- [ ] Grid se ve equilibrado con 4/5 modulos segun viewport.
- [ ] Hover/focus de cards funciona.

## Admin - proyectos

- [ ] `/admin/projects` lista proyectos.
- [ ] Crear proyecto guarda titulo, slug automatico, resumen, descripcion y metadata.
- [ ] Editar proyecto conserva/actualiza datos correctamente.
- [ ] Slug se genera correctamente al crear.
- [ ] Activar/desactivar proyecto funciona.
- [ ] Proyecto activo aparece en publico.
- [ ] Proyecto inactivo no aparece en publico.
- [ ] Marcar destacado afecta Home/carrusel cuando corresponde.
- [ ] Seleccion multiple de categorias funciona.
- [ ] Especializacion principal se selecciona con dropdown custom.
- [ ] Subir portada acepta JPG, PNG o WebP validos.
- [ ] Subir portada rechaza formatos o tamanios no permitidos.
- [ ] Subir galeria funciona.
- [ ] Subir plano acepta imagen/PDF permitido.
- [ ] Ocultar/mostrar media funciona.
- [ ] Reordenar media funciona.
- [ ] Eliminar media abre modal propio, no `window.confirm`.
- [ ] Eliminar media quita el documento de media.
- [ ] Reordenar proyectos guarda `sortOrder`.
- [ ] Eliminar proyecto abre modal profesional.
- [ ] Confirmar eliminar proyecto borra documento Firestore.
- [ ] Confirmar eliminar proyecto borra media/portada de Storage solo si tienen `storagePath`.
- [ ] Eliminar proyecto no borra categorias asociadas.
- [ ] Tras eliminar proyecto, desaparece del listado.

## Admin - categorias

- [ ] `/admin/categories` lista categorias.
- [ ] Crear categoria genera slug y orden inicial.
- [ ] Editar categoria guarda nombre, descripcion, estado e imagen.
- [ ] Subir/reemplazar imagen de categoria funciona.
- [ ] Activar/desactivar categoria funciona.
- [ ] Reordenar categorias guarda `sortOrder`.
- [ ] Eliminar categoria abre modal profesional.
- [ ] Si la categoria tiene proyectos asociados, la accion cambia a ocultar.
- [ ] Si la categoria tiene blogs asociados, la accion cambia a ocultar.
- [ ] Al ocultar categoria con relaciones, se guarda `isActive: false`.
- [ ] Al ocultar categoria con relaciones, no se eliminan proyectos/blogs.
- [ ] Si la categoria no tiene relaciones, se elimina fisicamente.
- [ ] Al eliminar fisicamente categoria, se borra su imagen de Storage si `coverMedia.storagePath` existe.
- [ ] Si la imagen de categoria es externa o no tiene `storagePath`, no intenta borrar Storage.
- [ ] Tras eliminar categoria, desaparece del listado.

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
