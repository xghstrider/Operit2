// ignore_for_file: file_names

import 'package:flutter/material.dart';

import '../../../core/proxy/generated/CoreProxyModels.g.dart' as core_proxy;

class CommonNetworkErrorView extends StatelessWidget {
  const CommonNetworkErrorView({
    super.key,
    this.errorDetails,
    this.errorText,
  });

  final core_proxy.CoreProxyErrorDetails? errorDetails;
  final String? errorText;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final summary = NetworkErrorSummary.fromDetails(errorDetails, errorText);

    return Semantics(
      liveRegion: true,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: colorScheme.errorContainer.withValues(alpha: 0.34),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: colorScheme.error.withValues(alpha: 0.18),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Icon(
                summary.icon,
                size: 20,
                color: colorScheme.error,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      summary.title,
                      style: textTheme.titleSmall?.copyWith(
                        color: colorScheme.onErrorContainer,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      summary.message,
                      style: textTheme.bodySmall?.copyWith(
                        color: colorScheme.onErrorContainer,
                        height: 1.35,
                      ),
                    ),
                    if (summary.detail != null) ...<Widget>[
                      const SizedBox(height: 6),
                      Text(
                        summary.detail!,
                        style: textTheme.bodySmall?.copyWith(
                          color: colorScheme.onErrorContainer.withValues(
                            alpha: 0.74,
                          ),
                          height: 1.35,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class NetworkErrorSummary {
  const NetworkErrorSummary({
    required this.title,
    required this.message,
    required this.icon,
    this.detail,
  });

  final String title;
  final String message;
  final String? detail;
  final IconData icon;

  /// Converts structured runtime error details into a visible summary.
  factory NetworkErrorSummary.fromDetails(
    core_proxy.CoreProxyErrorDetails? details,
    String? text,
  ) {
    final statusCode = details?.httpStatus;
    final remoteMessage =
        details?.remoteMessage ??
        details?.stringField('value') ??
        details?.message ??
        text;

    if (statusCode == 400) {
      return NetworkErrorSummary(
        title: 'Invalid Request Parameters',
        message: 'The server rejected this model list request. Please check that the service address and the provider match.',
        detail: remoteMessage,
        icon: Icons.tune_rounded,
      );
    }

    if (statusCode == 401) {
      return NetworkErrorSummary(
        title: 'API Key Verification Failed',
        message: 'The access API key failed provider verification. Please paste the full key again and fetch the models.',
        detail: remoteMessage,
        icon: Icons.key_off_rounded,
      );
    }

    if (statusCode == 403) {
      return NetworkErrorSummary(
        title: 'No Access Permission',
        message: 'The current API key is not allowed to access this provider API. Please confirm the account permissions and that the model service is enabled.',
        detail: remoteMessage,
        icon: Icons.lock_outline_rounded,
      );
    }

    if (statusCode == 404) {
      return NetworkErrorSummary(
        title: 'Service Address Unavailable',
        message: 'No model list endpoint was found at the current service address. Please check that the address path is correct.',
        detail: remoteMessage,
        icon: Icons.link_off_rounded,
      );
    }

    if (statusCode == 429) {
      return NetworkErrorSummary(
        title: 'Too Many Requests',
        message: 'The provider has rate-limited the current requests. Please try fetching models again later.',
        detail: remoteMessage,
        icon: Icons.hourglass_top_rounded,
      );
    }

    if (statusCode != null && statusCode >= 500) {
      return NetworkErrorSummary(
        title: 'Provider Service Error',
        message: 'The provider is temporarily unable to process the model list request. Please try again later.',
        detail: remoteMessage,
        icon: Icons.cloud_off_rounded,
      );
    }

    if (details?.variant == 'ModelListFetch') {
      return NetworkErrorSummary(
        title: 'Failed to Fetch Model List',
        message: 'The model list was not received from the provider. Please check the service address, access API key, and network connection.',
        detail: remoteMessage,
        icon: Icons.wifi_off_rounded,
      );
    }

    if (details?.kind == 'network') {
      return NetworkErrorSummary(
        title: 'Network Connection Failed',
        message: 'Unable to connect to the model provider. Please check the network connection and service address.',
        detail: remoteMessage,
        icon: Icons.wifi_off_rounded,
      );
    }

    if (details?.variant == 'ModelAlreadyExists') {
      final duplicateDetails = details!;
      final modelId = duplicateDetails.stringField('modelId')!;
      final providerName = duplicateDetails.stringField('providerName')!;
      return NetworkErrorSummary(
        title: 'Model Already Exists',
        message: 'Model "$modelId" has already been added to provider "$providerName".',
        icon: Icons.info_outline_rounded,
      );
    }

    return NetworkErrorSummary(
      title: 'Model Configuration Failed',
      message: 'An exception occurred while fetching available models. Please check the provider, service address, and access API key.',
      detail: remoteMessage,
      icon: Icons.error_outline_rounded,
    );
  }
}
