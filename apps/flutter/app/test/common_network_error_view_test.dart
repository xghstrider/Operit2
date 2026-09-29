import 'package:flutter_test/flutter_test.dart';
import 'package:operit2/core/proxy/generated/CoreProxyModels.g.dart'
    as core_proxy;
import 'package:operit2/ui/common/components/CommonNetworkErrorView.dart';

/// Verifies summaries used by model configuration error surfaces.
void main() {
  test('model duplicates are described with the model and provider names', () {
    final summary = NetworkErrorSummary.fromDetails(
      const core_proxy.CoreProxyErrorDetails(
        errorType: 'ModelConfigError',
        message: 'model already exists: provider-id:gpt-5.6-sol',
        variant: 'ModelAlreadyExists',
        fields: <String, Object?>{
          'providerId': 'provider-id',
          'providerName': 'OpenAI',
          'modelId': 'gpt-5.6-sol',
        },
      ),
      null,
    );

    expect(summary.title, 'Model Already Exists');
    expect(
      summary.message,
      'Model "gpt-5.6-sol" has already been added to provider "OpenAI".',
    );
    expect(summary.detail, isNull);
  });
}
