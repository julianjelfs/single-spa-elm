# Single Spa Elm

This is a simple adaptor for Elm sub applications being used with the [single spa micro-frontends library](https://github.com/CanopyTax/single-spa). 

Usage looks something like this:

```js
import { Elm } from "./src/Main.elm";
import singleSpaElm from "single-spa-elm";

const elmLifecycles = singleSpaElm({
  elmMain: Elm.Main,
  domElementGetter: () => document.getElementById("elm-app")
});

// we don't generally need to do anything special on bootstrap
export const bootstrap = elmLifecycles.bootstrap;

export const mount = props => {
  // any props you supply will be spread onto the flags property used to initialise the Elm app
  return elmLifecycles.mount(props).then(elm => {
    // if you need to access the ports you can do so here via elm.ports
  });
};

// we don't generally need to do anything special on unmount
export const unmount = elmLifecycles.unmount;

```
