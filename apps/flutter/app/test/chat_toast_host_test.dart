import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:operit2/ui/features/chat/components/ChatToastHost.dart';

/// Verifies that wrapped short toast messages retain every visible line.
void main() {
  testWidgets('wrapped toast messages are not constrained to one line', (
    tester,
  ) async {
    const message =
        'Add and select a speech recognition configuration in Settings before starting voice input.';

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: Center(
            child: SizedBox(
              width: 280,
              child: ChatToastHost(message: message, onDismiss: () {}),
            ),
          ),
        ),
      ),
    );

    expect(tester.getSize(find.text(message)).height, greaterThan(28));
  });
}
