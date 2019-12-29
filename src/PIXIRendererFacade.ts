/**
 * Facade class that handles rendering of the PIXI elements depending on
 * the type of the element.
 *
 * @export
 * @class PIXIRendererFacade
 */
class PIXIRendererFacade {
  process(element: PIXI.DisplayObject, subView: any) {
    element.position.x = subView.left;
    element.position.y = subView.top;

    switch (element.constructor) {
      case PIXI.Graphics:
        const graphic = <PIXI.Graphics>element;
        graphic.width = subView.width;
        graphic.height = subView.height;
        break;

      default:
        break;
    }
  }
}

export default PIXIRendererFacade;
