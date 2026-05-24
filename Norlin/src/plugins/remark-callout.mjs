import { visit } from 'unist-util-visit';

const calloutConfigs = {
  note: {
    title: 'Note',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="currentColor"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>',
  },
  tip: {
    title: 'Tip',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="18" height="18" fill="currentColor"><path d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2c0 0 0 0 0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4c0 0 0 0 0 0c19.8 27.1 39.7 54.4 49.2 86.2l160 0zM192 512c44.2 0 80-35.8 80-80l0-16-160 0 0 16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z"/></svg>',
  },
  important: {
    title: 'Important',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="currentColor"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>',
  },
  warning: {
    title: 'Warning',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="currentColor"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>',
  },
  caution: {
    title: 'Caution',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="currentColor"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>',
  },
};

export function remarkCalloutDirective() {
  return (tree) => {
    visit(tree, 'containerDirective', (node) => {
      const type = node.name.toLowerCase();

      if (calloutConfigs[type]) {
        const config = calloutConfigs[type];
        const title = node.attributes?.title || config.title;

        node.data = {
          hName: 'div',
          hProperties: {
            className: ['callout-box', `callout-${type}`],
          },
        };

        const headerNode = {
          type: 'paragraph',
          data: {
            hName: 'div',
            hProperties: { className: 'callout-icon-and-type' },
          },
          children: [
            {
              type: 'html',
              value: `<span class="callout-icon">${config.icon}</span>`,
            },
            {
              type: 'html',
              value: `<span class="callout-type">${title}</span>`,
            },
          ],
        };

        const contentNode = {
          type: 'div',
          data: {
            hName: 'div',
            hProperties: { className: 'callout-content' },
          },
          children: node.children,
        };

        node.children = [headerNode, contentNode];
      }
    });
  };
}

export function remarkCalloutGithub() {
  return (tree) => {
    visit(tree, 'blockquote', (node, index, parent) => {
      const firstChild = node.children[0];
      if (!firstChild || firstChild.type !== 'paragraph') return;

      const firstTextNode = firstChild.children[0];
      if (!firstTextNode || firstTextNode.type !== 'text') return;

      const match = firstTextNode.value.match(/^\[!(note|tip|important|warning|caution)\]\s*(.*)/i);
      if (!match) return;

      const type = match[1].toLowerCase();
      const customTitle = match[2].trim();
      const config = calloutConfigs[type];
      const title = customTitle || config.title;

      firstTextNode.value = firstTextNode.value.replace(/^\[!.*?\]\s*(.*)/i, '');

      if (!firstTextNode.value.trim() && firstChild.children.length === 1) {
        node.children.shift();
      }

      const calloutNode = {
        type: 'html',
        value: `
        <div class="callout-box callout-${type}">
          <div class="callout-icon-and-type">
            <span class="callout-icon">${config.icon}</span>
            <span class="callout-type">${title}</span>
          </div>
          <div class="callout-content">
        `,
      };

              const closingNode = {
                type: 'html',
                value: `
          </div>
        </div>
        `,
      };

        parent.children.splice(index, 1, calloutNode, ...node.children, closingNode);
    });
  };
}

export function remarkCallout() {
  return (tree, file) => {
    remarkCalloutDirective()(tree, file);
    remarkCalloutGithub()(tree, file);
  };
}