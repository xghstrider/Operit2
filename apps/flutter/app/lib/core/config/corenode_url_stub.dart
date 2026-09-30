/// Non-web default CoreNode address resolution.
///
/// The value is injected at build time with:
/// `--dart-define=CORENODE_URL=https://your-core-node.example.com`
const String kCoreNodeUrlDefine = String.fromEnvironment('CORENODE_URL');

/// Returns the default CoreNode address for manual pairing.
String resolveDefaultCoreNodeUrl() => kCoreNodeUrlDefine;
