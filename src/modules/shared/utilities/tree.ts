export function convertTreeToList(root) {
    const stack = [], array = [];
    stack.push(root);

    while (stack.length !== 0) {
        const node = stack.pop();
        if (node && node.id !== root.id) {
            array.push({
                ...node,
                children: []
            });
        }
        if (node.children) {
            for (let i = node.children.length - 1; i >= 0; i--) {
                stack.push(node.children[i]);
            }
        }
    }

    return array;
}

