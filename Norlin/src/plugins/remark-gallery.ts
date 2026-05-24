import { visit } from 'unist-util-visit';

export default function remarkGallery() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (
        node.type === 'containerDirective' &&
        node.name === 'gallery'
      ) {
        const images: any[] = [];
        const rest: any[] = [];

        for (const child of node.children || []) {
          if (child.type === 'paragraph') {
            const paragraphImages = child.children.filter((c: any) => c.type === 'image');
            const paragraphOther = child.children.filter((c: any) => c.type !== 'image');

            if (paragraphImages.length > 0) {
              images.push(...paragraphImages);
            }

            if (paragraphOther.length > 0) {
              rest.push({
                ...child,
                children: paragraphOther
              });
            }
          } else {
            rest.push(child);
          }
        }

        const galleryDiv = {
          type: 'paragraph',
          data: {
            hName: 'div',
            hProperties: { class: 'gallery' },
          },
          children: images,
        };

        node.data = {
          hName: 'div',
          hProperties: { class: 'gallery-box' },
        };

        node.children = [galleryDiv, ...rest];
      }
    });
  };
}