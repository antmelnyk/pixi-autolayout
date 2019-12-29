import * as PIXI from "pixi.js";
import PIXIRendererFacade from "./PIXIRendererFacade";
const AutoLayout = require("autolayout");

/**
 * PIXI Layout is a wrapper around autolayout.js library that helps automatically set and calculate
 * element positioning and sizes using Visual Format Language.
 *
 * @class PIXILayout
 */
class PIXILayout {
  /**
   * The VFL markup can be either a string or an array of strings.
   * Strings may also contain '\n' which indicates that a new line of VFL will begin.
   *
   * @private
   * @type {(string | Array<string>)}
   * @memberof Layout
   */
  private _vfl: string | Array<string>;

  /**
   * PIXI Application related to this layout.
   *
   * @private
   * @type {PIXI.Application}
   * @memberof PIXILayout
   */
  private _app: PIXI.Application;

  /**
   * Root PIXI container relative to which children elements will be positioned.
   * If not set, children will be positioned relative to app's canvas.
   *
   * @private
   * @type {PIXI.Container}
   * @memberof Layout
   */
  private _parent: PIXI.Container;

  /**
   * Renderer is a facade class that processes updates for different PIXI objects.
   *
   * @private
   * @memberof Layout
   */
  private _renderer = new PIXIRendererFacade();

  /**
   * Superview for this layout.
   *
   * @private
   * @type {*}
   * @memberof Layout
   */
  public view: any = new AutoLayout.View();

  /**
   * Children PIXI elements for this layout parent PIXI container.
   *
   * @private
   * @type {Array<PIXI.DisplayObject>}
   * @memberof Layout
   */
  public children: Map<string, PIXI.DisplayObject> = new Map();

  /**
   * Creates an instance of Layout. Creates new AutoLayout view and applies constraints to it.
   * Renders objects based on calculated constraints.
   *
   * @param {PIXI.Container} parent
   * @param {Array<string> | string} vfl
   * @memberof Layout
   */
  constructor(
    vfl: Array<string> | string,
    app: PIXI.Application,
    parent?: PIXI.Container
  ) {
    this._vfl = vfl;
    this._app = app;

    if (parent) {
      this._parent = parent;
    }

    this.addConstraints();
    this.setChildren();
  }

  /**
   * Render/position all PIXI elements to match superview constraints.
   *
   * @memberof PIXILayout
   */
  public render() {
    if (this._parent) {
      this.view.setSize(this._parent.width, this._parent.height);
    } else {
      this.view.setSize(this._app.view.width, this._app.view.height);
    }

    for (let key in this.view.subViews) {
      if (this.children.has(key)) {
        this.updateElement(key);
      }
    }
  }

  /**
   * Render/position PIXI element based on subview calculations.
   *
   * @private
   * @param {string} key
   * @memberof PIXILayout
   */
  private updateElement(key: string) {
    const subView = this.view.subViews[key];
    const element = this.children.get(key);

    if (element) {
      this._renderer.process(element, subView);
    } else {
      console.warn(`PIXI object with name ${key} not found!`);
    }
  }

  /**
   * Parse VFL string(s) and apply their constraints to the superview.
   *
   * @private
   * @memberof Layout
   */
  private addConstraints() {
    try {
      this.view.addConstraints(
        AutoLayout.VisualFormat.parse(this._vfl, { extended: true })
      );
    } catch (err) {
      console.warn("VFL parse error: " + err.toString());
    }
  }

  /**
   * Find and save PIXI object that relate to its subview.
   *
   * @private
   * @memberof Layout
   */
  private setChildren() {
    for (let key in this.view.subViews) {
      const element = this._app.stage.getChildByName(key);

      if (element) {
        this.children.set(key, element);
      }
    }
  }
}

export default PIXILayout;
