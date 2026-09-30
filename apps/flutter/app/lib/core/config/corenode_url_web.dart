import 'dart:js_interop';

import 'corenode_url_stub.dart' show kCoreNodeUrlDefine;

@JS('CORENODE_URL')
external JSAny? get _coreNodeUrlGlobal;

/// Returns the default CoreNode address on the web platform.
///
/// Resolution order:
/// 1. `window.CORENODE_URL` when the deployment shell defines it as a
///    non-empty string (allows changing the default without rebuilding),
/// 2. the compile-time `--dart-define=CORENODE_URL=...` value,
/// 3. an empty string, keeping the manual pairing dialog untouched.
String resolveDefaultCoreNodeUrl() {
  final JSAny? value = _coreNodeUrlGlobal;
  if (value.isUndefinedOrNull || value.typeofValue != 'string') {
    return kCoreNodeUrlDefine;
  }
  final String text = (value as JSString).toDart.trim();
  if (text.isEmpty) {
    return kCoreNodeUrlDefine;
  }
  return text;
}
