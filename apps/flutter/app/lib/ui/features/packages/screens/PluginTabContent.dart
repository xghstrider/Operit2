// ignore_for_file: file_names

import 'package:flutter/material.dart';

import '../../../../core/proxy/generated/CoreProxyModels.g.dart' as core_proxy;
import '../../../common/components/M3LoadingIndicator.dart';
import '../components/EmptyState.dart';
import '../components/PackageGrid.dart';
import '../components/PackageListItem.dart';
import '../utils/PackageDisplayUtils.dart';

class PluginTabContent extends StatelessWidget {
  /// Creates the plugin tab content.
  const PluginTabContent({
    super.key,
    required this.plugins,
    required this.morePlugins,
    required this.loadIssues,
    required this.enabledPluginNames,
    required this.isLoading,
    required this.isSearchActive,
    required this.onOpenPluginUi,
    required this.onPluginTap,
    required this.onLoadMorePlugin,
    required this.onPluginEnabledChanged,
    this.onPluginReordered,
    required this.onLoadIssueTap,
  });

  final List<core_proxy.ToolPkgContainerRuntime> plugins;
  final List<core_proxy.BundledExternalPackageCandidate> morePlugins;
  final List<core_proxy.ToolPkgLoadIssue> loadIssues;
  final Set<String> enabledPluginNames;
  final bool isLoading;
  final bool isSearchActive;
  final ValueChanged<core_proxy.ToolPkgContainerRuntime> onOpenPluginUi;
  final ValueChanged<core_proxy.ToolPkgContainerRuntime> onPluginTap;
  final ValueChanged<core_proxy.BundledExternalPackageCandidate>
  onLoadMorePlugin;
  final void Function(core_proxy.ToolPkgContainerRuntime plugin, bool enabled)
  onPluginEnabledChanged;
  final void Function(String sourcePackageName, String targetPackageName)?
  onPluginReordered;
  final ValueChanged<core_proxy.ToolPkgLoadIssue> onLoadIssueTap;

  /// Builds the plugin tab with lazily rendered expandable sections.
  @override
  Widget build(BuildContext context) {
    if (plugins.isEmpty &&
        morePlugins.isEmpty &&
        loadIssues.isEmpty &&
        isLoading) {
      return const M3LoadingPane();
    }
    return Stack(
      children: <Widget>[
        CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: <Widget>[
            if (plugins.isEmpty && morePlugins.isEmpty && loadIssues.isEmpty)
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 120),
                sliver: SliverToBoxAdapter(
                  child: EmptyState(
                    icon: Icons.extension_off_outlined,
                    title: 'No Plugins',
                    message: isSearchActive
                        ? 'No matching plugins.'
                        : 'No ToolPkg plugins to display right now.',
                    scrollable: false,
                  ),
                ),
              )
            else ...<Widget>[
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
                sliver: const SliverToBoxAdapter(
                  child: _PluginSectionHeader(title: 'Current Plugins'),
                ),
              ),
              if (plugins.isEmpty && loadIssues.isEmpty)
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
                  sliver: SliverToBoxAdapter(
                    child: _PluginSectionEmpty(
                      message: isSearchActive ? 'No matching current plugins.' : 'No plugins to display right now.',
                    ),
                  ),
                )
              else
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
                  sliver: PackageSliverList(
                    itemCount: plugins.length,
                    itemBuilder: (context, index) {
                      final plugin = plugins[index];
                      final issueMessage = plugin.dependencyIssues.isEmpty
                          ? null
                          : _pluginDependencyIssueMessage(plugin);
                      final item = PackageListItem(
                        key: ValueKey<String>('plugin:${plugin.packageName}'),
                        icon: Icons.extension_outlined,
                        title: toolPkgContainerDisplayName(plugin),
                        subtitle: localizedText(plugin.description),
                        metadata: <String>[
                          plugin.packageName,
                          'v${plugin.version}',
                          '${plugin.subpackages.length} subpackages',
                          if (plugin.dependencyIssues.isNotEmpty)
                            '${plugin.dependencyIssues.length} dependency plugin issues',
                        ],
                        hasError: plugin.dependencyIssues.isNotEmpty,
                        errorMessage: issueMessage,
                        enabled: enabledPluginNames.contains(
                          plugin.packageName,
                        ),
                        onDetails: () => onPluginTap(plugin),
                        onEnabledChanged: (enabled) =>
                            onPluginEnabledChanged(plugin, enabled),
                        trailingActions: toolPkgHasUi(plugin)
                            ? <Widget>[
                                IconButton(
                                  tooltip:
                                      enabledPluginNames.contains(
                                        plugin.packageName,
                                      )
                                      ? 'Open'
                                      : 'Open after enabling',
                                  onPressed:
                                      enabledPluginNames.contains(
                                        plugin.packageName,
                                      )
                                      ? () => onOpenPluginUi(plugin)
                                      : null,
                                  icon: const Icon(Icons.open_in_new_outlined),
                                ),
                              ]
                            : const <Widget>[],
                      );
                      final onReordered = onPluginReordered;
                      if (onReordered == null) {
                        return item;
                      }
                      return _PluginReorderTarget(
                        plugin: plugin,
                        onReordered: onReordered,
                        child: item,
                      );
                    },
                  ),
                ),
              if (loadIssues.isNotEmpty) ...<Widget>[
                const SliverToBoxAdapter(child: SizedBox(height: 16)),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
                  sliver: const SliverToBoxAdapter(
                    child: _PluginSectionHeader(
                      title: 'Load Failed',
                      subtitle: 'These plugins failed to parse or register. Tap a card to view the full error.',
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
                  sliver: PackageSliverList(
                    itemCount: loadIssues.length,
                    itemBuilder: (context, index) {
                      final issue = loadIssues[index];
                      return PackageListItem(
                        key: ValueKey<String>(
                          'plugin-load-issue:${issue.sourcePath}:${issue.code}:$index',
                        ),
                        icon: Icons.error_outline,
                        title: issue.displayName,
                        subtitle: issue.message,
                        metadata: <String>[
                          issue.packageName ?? '',
                          issue.packageKind,
                          issue.code,
                          issue.sourcePath,
                        ],
                        enabled: false,
                        showEnabledSwitch: false,
                        hasError: true,
                        errorMessage: issue.message,
                        onEnabledChanged: (_) {},
                        onDetails: () => onLoadIssueTap(issue),
                      );
                    },
                  ),
                ),
              ],
              if (morePlugins.isNotEmpty) ...<Widget>[
                const SliverToBoxAdapter(child: SizedBox(height: 16)),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
                  sliver: const SliverToBoxAdapter(
                    child: _PluginSectionHeader(
                      title: 'More Plugins',
                      subtitle: 'Official extra plugins bundled with the app. They are added to current plugins once loaded.',
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 120),
                  sliver: PackageSliverList(
                    itemCount: morePlugins.length,
                    itemBuilder: (context, index) {
                      final plugin = morePlugins[index];
                      final kindLabel = plugin.isToolPkg ? 'ToolPkg' : 'Script package';
                      return PackageListItem(
                        key: ValueKey<String>(
                          'bundled-plugin:${plugin.packageName}',
                        ),
                        icon: plugin.isToolPkg
                            ? Icons.extension_outlined
                            : Icons.inventory_2_outlined,
                        title: bundledExternalPackageDisplayName(plugin),
                        subtitle: localizedText(plugin.description),
                        metadata: <String>[
                          plugin.packageName,
                          kindLabel,
                          if (plugin.version.trim().isNotEmpty)
                            'v${plugin.version}',
                          '${plugin.toolCount} tools',
                          if (plugin.subpackageCount > 0)
                            '${plugin.subpackageCount} subpackages',
                          'Official extra',
                        ],
                        enabled: false,
                        onEnabledChanged: (_) {},
                        showEnabledSwitch: false,
                        trailingActions: <Widget>[
                          FilledButton.tonalIcon(
                            onPressed: () => onLoadMorePlugin(plugin),
                            icon: const Icon(Icons.add, size: 18),
                            label: const Text('Load'),
                            style: FilledButton.styleFrom(
                              visualDensity: VisualDensity.compact,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                              ),
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ),
              ] else
                const SliverToBoxAdapter(child: SizedBox(height: 120)),
            ],
          ],
        ),
        if ((plugins.isNotEmpty ||
                morePlugins.isNotEmpty ||
                loadIssues.isNotEmpty) &&
            isLoading)
          const Positioned.fill(child: M3LoadingOverlay()),
      ],
    );
  }
}

/// Resolves the compact dependency error shown on a plugin card.
String _pluginDependencyIssueMessage(
  core_proxy.ToolPkgContainerRuntime plugin,
) {
  final issues = plugin.dependencyIssues;
  if (issues.length > 1) {
    return '${issues.length} dependency plugins unavailable';
  }
  final issue = issues.single;
  return switch (issue.code) {
    'missing' => 'Missing dependency plugin: ${issue.id}',
    'disabled' => 'Dependency plugin not enabled: ${issue.id}',
    'version_incompatible' => 'Dependency plugin version not satisfied: ${issue.id}',
    'load_order' => 'Dependency plugin load order error: ${issue.id}',
    _ => throw StateError(
      'Unsupported ToolPkg dependency issue code: ${issue.code}',
    ),
  };
}

class _PluginReorderTarget extends StatelessWidget {
  /// Creates a draggable plugin card and its reorder drop target.
  const _PluginReorderTarget({
    required this.plugin,
    required this.onReordered,
    required this.child,
  });

  final core_proxy.ToolPkgContainerRuntime plugin;
  final void Function(String sourcePackageName, String targetPackageName)
  onReordered;
  final Widget child;

  /// Builds the long-press drag source for one plugin card.
  @override
  Widget build(BuildContext context) {
    return DragTarget<String>(
      onWillAcceptWithDetails: (details) => details.data != plugin.packageName,
      onAcceptWithDetails: (details) =>
          onReordered(details.data, plugin.packageName),
      builder: (context, candidateData, rejectedData) {
        final isDropTarget = candidateData.isNotEmpty;
        return LayoutBuilder(
          builder: (context, constraints) => AnimatedScale(
            scale: isDropTarget ? 1.015 : 1,
            duration: const Duration(milliseconds: 140),
            child: LongPressDraggable<String>(
              data: plugin.packageName,
              delay: const Duration(milliseconds: 160),
              hapticFeedbackOnStart: true,
              maxSimultaneousDrags: 1,
              feedback: Material(
                color: Colors.transparent,
                elevation: 8,
                shadowColor: Theme.of(context).colorScheme.shadow,
                child: SizedBox(
                  width: constraints.maxWidth,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      color: Theme.of(
                        context,
                      ).colorScheme.surfaceContainerHighest,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: child,
                  ),
                ),
              ),
              childWhenDragging: child,
              child: child,
            ),
          ),
        );
      },
    );
  }
}

class _PluginSectionHeader extends StatelessWidget {
  /// Creates a package section heading.
  const _PluginSectionHeader({required this.title, this.subtitle});

  final String title;
  final String? subtitle;

  /// Builds a section heading for a package group.
  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final subtitle = this.subtitle;
    return Padding(
      padding: const EdgeInsets.fromLTRB(4, 4, 4, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            title,
            style: Theme.of(
              context,
            ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
          ),
          if (subtitle != null) ...<Widget>[
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _PluginSectionEmpty extends StatelessWidget {
  /// Creates a package section empty state.
  const _PluginSectionEmpty({required this.message});

  final String message;

  /// Builds the empty state shown for a package section.
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(4, 0, 4, 4),
      child: Text(
        message,
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
          color: Theme.of(context).colorScheme.onSurfaceVariant,
        ),
      ),
    );
  }
}
