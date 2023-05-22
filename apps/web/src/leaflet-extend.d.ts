import 'leaflet';

declare module 'leaflet' {
  namespace Control {
    class Search extends Control {}
    class UserMenu extends Control {}
    class Draw extends Control {}
    class EditDrawActions extends Control {}
  }
  export namespace control {
    function search(options?: ControlOptions): Control.Search;
    function userMenu(options?: ControlOptions): Control.UserMenu;
    function draw(options?: ControlOptions): Control.Draw;
    function editDrawActions(options?: ControlOptions): Control.EditDrawActions;
  }

  namespace Polyline {
    function fromEncoded(encoded: string);
  }
}
