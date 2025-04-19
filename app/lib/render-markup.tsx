import ReactDOMServer from 'react-dom/server';

export function renderMarkup(children: React.ReactNode) {
  return ReactDOMServer.renderToStaticMarkup(<>{children}</>);
}
