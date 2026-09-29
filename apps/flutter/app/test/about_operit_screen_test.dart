import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:operit2/data/preferences/UserPreferencesManager.dart';
import 'package:operit2/ui/features/settings/about/AboutOperitScreen.dart';
import 'package:operit2/ui/theme/OperitTheme.dart';

/// Exercises the rendered About page and its license dialog.
void main() {
  testWidgets('about page displays project details and licenses', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(1200, 1000));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    await tester.pumpWidget(
      OperitTheme(
        initialThemePreferenceSnapshot:
            UserPreferencesManager.defaultThemePreferenceSnapshot,
        initialThemeIsReady: false,
        unconfiguredChildEnabled: true,
        hostInteractionHostsEnabled: false,
        child: const Scaffold(body: AboutOperitScreen()),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Operit2'), findsWidgets);
    expect(find.text('Version 2.0.0+6'), findsOneWidget);
    expect(find.text('Project Source Code'), findsOneWidget);

    await tester.tap(find.text('Open-Source License'));
    await tester.pumpAndSettle();

    expect(find.text('flutter_math_fork'), findsOneWidget);
    expect(find.text('AGPL-3.0'), findsWidgets);
  });
}
