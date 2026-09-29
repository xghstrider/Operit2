// ignore_for_file: file_names

sealed class PluginCreationIntent {
  const PluginCreationIntent({required this.requirement});

  final String requirement;

  String toPrompt();
}

class FreshPluginCreationIntent extends PluginCreationIntent {
  const FreshPluginCreationIntent({required super.requirement});

  @override
  String toPrompt() {
    return _buildCreationPrompt(
      taskLine: 'Use the PackageBuilder skill and the operit_editor package to develop a new sandbox package.',
      packageRuleLine: 'Decide the new sandbox package id first and do not rename it afterwards.',
      devDirectoryLine:
          'The development directory is fixed at Download/Operit/dev_package/the id you decided. Development, installation, and testing are all done only here.',
      requirement: requirement,
    );
  }
}

class ContinuePluginCreationIntent extends PluginCreationIntent {
  const ContinuePluginCreationIntent({
    required this.runtimePackageId,
    required super.requirement,
  });

  final String runtimePackageId;

  @override
  String toPrompt() {
    return _buildCreationPrompt(
      taskLine:
          'Use the PackageBuilder skill and the operit_editor package to locate sandbox package $runtimePackageId, then continue developing and testing on top of this version.',
      packageRuleLine:
          'The current sandbox package id is $runtimePackageId. Keep both the package id and the plugin name unchanged; do not rename them or start a new package.',
      devDirectoryLine:
          'The development directory is fixed at Download/Operit/dev_package/$runtimePackageId. Development, installation, and testing are all done only here.',
      requirement: requirement,
    );
  }
}

class MergePluginCreationIntent extends PluginCreationIntent {
  const MergePluginCreationIntent({
    required this.runtimePackageId,
    required super.requirement,
  });

  final String runtimePackageId;

  @override
  String toPrompt() {
    return _buildCreationPrompt(
      taskLine:
          'Use the PackageBuilder skill and the operit_editor package to locate sandbox package $runtimePackageId, then continue merged development and testing on top of this version.',
      packageRuleLine:
          'The current sandbox package id is $runtimePackageId. Keep both the package id and the plugin name unchanged; do not rename them or start a new package.',
      devDirectoryLine:
          'The development directory is fixed at Download/Operit/dev_package/$runtimePackageId. Development, installation, and testing are all done only here.',
      requirement: requirement,
    );
  }
}

String _buildCreationPrompt({
  required String taskLine,
  required String packageRuleLine,
  required String devDirectoryLine,
  required String requirement,
}) {
  return <String>[
    taskLine,
    'Use the current version type definitions in PackageBuilder/types.',
    'When you need to work with packages, Skills, MCP, logs, or models, read the operit_editor package instructions and then call execute_cli_command.',
    devDirectoryLine,
    packageRuleLine,
    'Copy PackageBuilder/types to Download/Operit/dev_package/types, and reference the package directory via ../types.',
    'Complete development in the terminal: write ts and js, then compile the final js. Refer to examples for tsconfig.',
    'To make secondary development easier, packaging must include the ts sources and tsconfig.',
    'Requirements:',
    requirement.trim(),
  ].join('\n');
}
