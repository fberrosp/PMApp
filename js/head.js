const pageHead = document.getElementById('head');
const headContainer = document.createDocumentFragment();

const charsetMeta = document.createElement('meta');
charsetMeta.setAttribute('charset', 'utf-8');

const viewportMeta = document.createElement('meta');
viewportMeta.setAttribute('name', 'viewport');
viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, shrink-to-fit=no');

const authorMeta = document.createElement('meta');
authorMeta.setAttribute('name', 'Fernando Berrospi')

const bootstrapCSS = document.createElement('link');
bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css';
bootstrapCSS.setAttribute('rel', 'stylesheet');
bootstrapCSS.setAttribute('integrity', 'sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT');
bootstrapCSS.setAttribute('crossorigin', 'anonymous');

const customFontsCSS = document.createElement('link');
customFontsCSS.href = 'vendor/fontawesome-free/css/all.min.css';
customFontsCSS.setAttribute('rel', 'stylesheet');
customFontsCSS.setAttribute('type', 'text/css');

const googleFonts = document.createElement('link');
googleFonts.href = 'https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i';
googleFonts.setAttribute('rel', 'stylesheet');

const customStylesCSS = document.createElement('link');
customStylesCSS.href = 'css/sb-admin-2.min.css';
customStylesCSS.setAttribute('rel', 'stylesheet')

headContainer.appendChild(charsetMeta);
headContainer.appendChild(viewportMeta);
headContainer.appendChild(authorMeta);
headContainer.appendChild(bootstrapCSS);
headContainer.appendChild(customFontsCSS);
headContainer.appendChild(googleFonts);
headContainer.appendChild(customStylesCSS);

pageHead.appendChild(headContainer);