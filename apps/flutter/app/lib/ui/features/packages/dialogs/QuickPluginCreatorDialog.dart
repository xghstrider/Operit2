// ignore_for_file: file_names

import 'package:flutter/material.dart';

import '../../../../core/proxy/generated/CoreProxyClients.g.dart';
import '../../../common/components/M3LoadingIndicator.dart';
import '../screens/QuickPluginCreatorSetupSupport.dart';

class QuickPluginCreatorDialog extends StatefulWidget {
  const QuickPluginCreatorDialog({super.key, required this.clients});

  final GeneratedCoreProxyClients clients;

  static Future<String?> show({
    required BuildContext context,
    required GeneratedCoreProxyClients clients,
  }) {
    return showDialog<String>(
      context: context,
      builder: (context) => QuickPluginCreatorDialog(clients: clients),
    );
  }

  @override
  State<QuickPluginCreatorDialog> createState() =>
      _QuickPluginCreatorDialogState();
}

class _QuickPluginCreatorDialogState extends State<QuickPluginCreatorDialog> {
  final TextEditingController _requirementController = TextEditingController();
  bool _confirmRunning = false;
  QuickPluginCreatorSetupResult? _setupResult;
  String? _requirementError;

  @override
  void dispose() {
    _requirementController.dispose();
    super.dispose();
  }

  Future<void> _confirm() async {
    if (_confirmRunning) {
      return;
    }
    final requirement = _requirementController.text.trim();
    if (requirement.isEmpty) {
      setState(() {
        _requirementError = 'Please enter the plugin requirements first';
      });
      return;
    }
    setState(() {
      _confirmRunning = true;
      _setupResult = null;
    });
    final setupResult = await runQuickPluginCreatorSetup(widget.clients);
    if (!mounted) {
      return;
    }
    if (!setupResult.success) {
      setState(() {
        _confirmRunning = false;
        _setupResult = setupResult;
      });
      return;
    }
    Navigator.of(context).pop(requirement);
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final setupResult = _setupResult;
    return AlertDialog(
      title: const Text('Quickly Create Your Plugin'),
      content: SizedBox(
        width: 520,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              const _DialogSectionTitle('Plugin Requirements'),
              const SizedBox(height: 8),
              Text(
                'After confirmation, the PackageBuilder skill will be added and the built-in operit_editor package will be enabled.',
                style: TextStyle(color: colorScheme.onSurfaceVariant),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: _requirementController,
                minLines: 4,
                maxLines: 8,
                decoration: InputDecoration(
                  border: const OutlineInputBorder(),
                  hintText: 'For example: a tool that organizes images in the download directory in bulk and generates an index',
                  errorText: _requirementError,
                ),
                onChanged: (_) {
                  if (_requirementError != null) {
                    setState(() {
                      _requirementError = null;
                    });
                  }
                },
              ),
              if (setupResult != null && !setupResult.success) ...<Widget>[
                const SizedBox(height: 8),
                Text(
                  setupResult.error ?? 'Failed to prepare the plugin creation environment',
                  style: TextStyle(color: colorScheme.error),
                ),
              ],
            ],
          ),
        ),
      ),
      actions: <Widget>[
        TextButton(
          onPressed: _confirmRunning ? null : () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: _confirmRunning ? null : _confirm,
          child: _confirmRunning
              ? const M3LoadingIndicator(size: 16)
              : const Text('Confirm'),
        ),
      ],
    );
  }
}

class _DialogSectionTitle extends StatelessWidget {
  const _DialogSectionTitle(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(text, style: const TextStyle(fontWeight: FontWeight.w700));
  }
}
