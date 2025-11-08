import type { ResizeCorner } from "./types.ts";
import type { MouseEventHandler } from "react";
import { ResizeHandle } from "./ResizeHandle/ResizeHandle.tsx";

type ResizeCoverProps = {
    onResizeDown: (corner: ResizeCorner) => MouseEventHandler<HTMLDivElement>;

}

function ResizeCover({onResizeDown}: ResizeCoverProps) {
    return (
        <>
            <ResizeHandle onResizeDown={onResizeDown} resizeCorner={"t"} />
            <ResizeHandle onResizeDown={onResizeDown} resizeCorner={"tr"} />
            <ResizeHandle onResizeDown={onResizeDown} resizeCorner={"r"} />
            <ResizeHandle onResizeDown={onResizeDown} resizeCorner={"br"} />
            <ResizeHandle onResizeDown={onResizeDown} resizeCorner={"b"} />
            <ResizeHandle onResizeDown={onResizeDown} resizeCorner={"bl"} />
            <ResizeHandle onResizeDown={onResizeDown} resizeCorner={"l"} />
            <ResizeHandle onResizeDown={onResizeDown} resizeCorner={"tl"} />
        </>
    )
}

export {
    ResizeCover,
}