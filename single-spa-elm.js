const defaultOpts = {
  // required opts
  elmMain: null,
  domElementGetter: null
};

export default function singleSpaElm(userOpts) {
  if (typeof userOpts !== "object") {
    throw new Error(`single-spa-elm requires a configuration object`);
  }

  const opts = {
    ...defaultOpts,
    ...userOpts
  };

  if (!opts.elmMain) {
    throw new Error(
      `single-spa-elm must be passed opts.elmMain - this is the Main module of the Elm app you are trying to mount`
    );
  }

  if (!opts.domElementGetter) {
    throw new Error(
      `single-spa-elm must be passed opts.domElementGetter function otherwise we don't know where to attach the Elm app`
    );
  }

  return {
    bootstrap: bootstrap.bind(null, opts),
    mount: mount.bind(null, opts),
    unmount: unmount.bind(null, opts)
  };
}

// nothing much that we need to do on bootstrap
function bootstrap(opts) {
  return Promise.resolve();
}

function mount(opts, props) {
  return new Promise((resolve, reject) => {
    const root = getRootDomEl(opts);

    // we create a node inside the root node because elm 0.19 actually removed the node you attach to
    const node = document.createElement("div");
    root.appendChild(node);

    // we pass props straight through as flags. This might cause problems if your props contain things that cannot be decoded but
    // there's not much else that we can do
    const elm = opts.elmMain.init({
      flags: props,
      node
    });

    // resolve with the initialised elm app so that the calling code can access any ports
    resolve(elm);
  });
}

function unmount(opts) {
  return new Promise((resolve, reject) => {
    opts.domElementGetter().innerHTML = "";
    resolve();
  });
}

function getRootDomEl(opts) {
  const el = opts.domElementGetter();

  if (!el) {
    throw new Error(
      `single-spa-elm: domElementGetter function did not return a valid dom element`
    );
  }

  return el;
}
