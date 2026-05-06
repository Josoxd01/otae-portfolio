# QA checklist

## Web publica

- [ ] Home carga sin errores visibles.
- [ ] Home muestra proyecto destacado, areas de especializacion, bloque de estudio, CTA de contacto y footer.
- [ ] Proyectos carga listado desde datos disponibles.
- [ ] Proyectos filtra o navega por categoria sin romper el layout.
- [ ] Detalle de proyecto carga por slug valido.
- [ ] Detalle de proyecto muestra portada, descripcion y media visible cuando existe.
- [ ] Detalle de proyecto responde correctamente ante slug inexistente.
- [ ] Estudio muestra perfil, equipo y canales de contacto.
- [ ] Contacto muestra datos del estudio y canales disponibles.
- [ ] En mobile, tablet y desktop no hay solapes de texto, imagenes cortadas de forma inesperada ni scroll horizontal.

## Admin

- [ ] Login admin muestra formulario y estados de error.
- [ ] Login admin permite entrar con credenciales validas.
- [ ] Admin dashboard carga despues de autenticar.
- [ ] Crear proyecto guarda datos generales sin errores.
- [ ] Editar proyecto conserva slug existente y guarda cambios.
- [ ] Subir portada de proyecto acepta JPG, PNG o WebP menores a 5 MB.
- [ ] Subir portada de proyecto rechaza formatos no permitidos o archivos mayores a 5 MB.
- [ ] Subir galeria crea media visible y permite ocultar/mostrar.
- [ ] Subir plano acepta imagen o PDF permitido.
- [ ] Eliminar media pide confirmacion y actualiza listado.
- [ ] Reordenar proyectos guarda el nuevo orden.
- [ ] Crear categoria genera slug y orden inicial esperado.
- [ ] Editar categoria conserva slug existente.
- [ ] Reordenar categorias guarda el nuevo orden.
- [ ] Crear miembro de equipo guarda datos basicos.
- [ ] Editar miembro de equipo actualiza nombre, rol, bio y foto.
- [ ] Eliminar o desactivar miembro de equipo actualiza listado.
- [ ] Editar estudio guarda textos, datos de contacto e imagenes.

## Build final

- [ ] `npm run lint` pasa.
- [ ] `npm run test` pasa.
- [ ] `npx tsc --noEmit --pretty false` pasa.
- [ ] `npm run build` pasa.
- [ ] `/dev/styles` responde 404 y no muestra el playground.

## Pendiente para E2E

- [ ] Cubrir login admin con credenciales de entorno controlado.
- [ ] Cubrir CRUD de proyectos contra emuladores o entorno aislado.
- [ ] Cubrir subidas a Storage con emulador o bucket de prueba.
- [ ] Cubrir drag & drop de ordenamiento en admin.
- [ ] Cubrir smoke visual responsive con navegador real.
