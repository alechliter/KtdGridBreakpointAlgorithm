import {
    Layout,
    LayoutItem,
} from '@katoid/angular-grid-layout/lib/utils/react-grid-layout.utils';

export function wrapLayout(layout: Layout, bounds: { cols: number }): Layout {
    const sortedLayout = sortLayout(layout);
    const wrappedLayout: Layout = [];

    sortedLayout.forEach((item) => {
        if (item.x + item.w > bounds.cols) {
            if (bounds.cols - item.w < (item.minW ?? 0)) {
                item.w = bounds.cols;
            }

            item.x = 0;
            pushDown(item, wrappedLayout);
        }

        let collidingItems = getAllCollisions(wrappedLayout, item);
        let iteration = 0;
        const maxIterations = layout.length * bounds.cols;
        while (collidingItems.length > 0 && iteration < maxIterations) {
            let rightMostCollision = getRightMostItem(collidingItems);

            item.x = rightMostCollision.x + rightMostCollision.w;

            if (item.x + item.w > bounds.cols) {
                item.x = 0;
                pushDown(item, wrappedLayout);
            }

            iteration++;
            collidingItems = getAllCollisions(wrappedLayout, item);
        }

        if (iteration >= maxIterations) {
            throw Error(`Error: Max Iterations Reached - ${wrapLayout.name}`);
        } else {
            wrappedLayout.push(item);
        }
    });

    return wrappedLayout;
}

export function pushDown(item: LayoutItem, layout: Layout): void {
    const collidingItems = getAllCollisions(layout, item);

    if (collidingItems.length > 0) {
        let shortestCollision = getShortestItem(collidingItems);

        item.y = shortestCollision.y + shortestCollision.h;
    }
}

export function getShortestItem(items: Array<LayoutItem>): LayoutItem {
    let shortestItem = items[0];
    items.forEach((item) => {
        if (
            shortestItem.id !== item.id &&
            shortestItem.y + shortestItem.h > item.y + item.h
        ) {
            shortestItem = item;
        }
    });
    return shortestItem;
}

export function getRightMostItem(items: Array<LayoutItem>): LayoutItem {
    let rightMostItem = items[0];
    items.forEach((item) => {
        if (
            rightMostItem.id !== item.id &&
            rightMostItem.x + rightMostItem.w < item.x + item.w
        ) {
            rightMostItem = item;
        }
    });
    return rightMostItem;
}

export function sortLayout(layout: Layout): Layout {
    const sortedLayout: Layout = [];

    const rows: Map<number, Array<LayoutItem>> = new Map();
    layout.forEach((layoutItem) => {
        if (rows.has(layoutItem.y)) {
            rows.get(layoutItem.y)?.push(layoutItem);
        } else {
            rows.set(layoutItem.y, [layoutItem]);
        }
    });

    rows.forEach((row) => row.sort((l1, l2) => l1.x - l2.x));

    const sortedRowKeys = [...rows.keys()].sort((y1, y2) => y1 - y2);
    sortedRowKeys.forEach((rowKey) =>
        sortedLayout.push(...(rows.get(rowKey) ?? []))
    );

    return sortedLayout;
}

export function getAllCollisions(
    layout: Layout,
    layoutItem: LayoutItem
): Array<LayoutItem> {
    return layout.filter((l) => collides(l, layoutItem));
}

export function collides(l1: LayoutItem, l2: LayoutItem): boolean {
    if (l1.id === l2.id) {
        return false;
    } // same element
    if (l1.x + l1.w <= l2.x) {
        return false;
    } // l1 is left of l2
    if (l1.x >= l2.x + l2.w) {
        return false;
    } // l1 is right of l2
    if (l1.y + l1.h <= l2.y) {
        return false;
    } // l1 is above l2
    if (l1.y >= l2.y + l2.h) {
        return false;
    } // l1 is below l2
    return true; // boxes overlap
}
