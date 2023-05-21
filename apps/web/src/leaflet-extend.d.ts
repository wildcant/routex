import 'leaflet';

declare module 'leaflet' {
  interface CustomToolbarOptions {
    marker?: DrawOptions.MarkerOptions | undefined;
  }

  class CustomToolbar extends Class {
    constructor(options?: CustomToolbarOptions);
    createToolbar(): HTMLButtonElement;
  }

  namespace CustomDraw {
    class Feature extends Handler {
      initialize(): void;
      setOptions(): void;
    }
    class Marker extends Feature {
      marker: L.Marker;
      initialize();
    }
  }
  namespace Control {
    class UserMenu extends Control {}
    class CustomDraw extends Control {}
    class EditCustomDrawOptions extends Control {}
  }
  export namespace control {
    function userMenu(options?: ControlOptions): Control.UserMenu;
    function customDraw(options?: ControlOptions): Control.CustomDraw;
    function editCustomDrawOptions(options?: ControlOptions): Control.EditCustomDrawOptions;
  }
}
