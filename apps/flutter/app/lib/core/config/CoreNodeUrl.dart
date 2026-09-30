/// Default CoreNode address resolution for the runtime pairing dialog.
///
/// The active implementation is selected per platform: the web build can also
/// read a deployment-provided `window.CORENODE_URL` global, while every other
/// platform relies only on the compile-time dart-define value.
export 'corenode_url_stub.dart'
    if (dart.library.js_interop) 'corenode_url_web.dart';
