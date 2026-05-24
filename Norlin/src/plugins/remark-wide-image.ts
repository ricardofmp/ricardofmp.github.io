import { visit } from 'unist-util-visit';

export default function remarkWide() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (
        node.type === 'containerDirective' &&
        node.name === 'wide'
      ) {
        node.data = node.data || {};
        node.data.hName = 'div';
        node.data.hProperties = {
          class: 'image-wide',
        };
      }
    });
  };
}
