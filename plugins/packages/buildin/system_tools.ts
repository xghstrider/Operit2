/* METADATA
{
    "name": "system_tools",
    "display_name": { "zh": "System Tools", "en": "System Tools" },
    "description": {
        "zh": "Provides system settings, app management, notifications, location, device info, and Bluetooth operations.",
        "en": "System settings, app management, notifications, location, device information, and Bluetooth operations."
    },
    "enabledByDefault": true,
    "category": "System",
    "tools": [
        { "name": "get_system_setting", "description": { "zh": "Get a system setting.", "en": "Get a system setting." }, "parameters": [
            { "name": "setting", "description": { "zh": "Setting name.", "en": "Setting name." }, "type": "string", "required": true },
            { "name": "namespace", "description": { "zh": "Namespace: system, secure, or global.", "en": "Namespace: system, secure, or global." }, "type": "string", "required": false }
        ] },
        { "name": "modify_system_setting", "description": { "zh": "Modify a system setting.", "en": "Modify a system setting." }, "parameters": [
            { "name": "setting", "description": { "zh": "Setting name.", "en": "Setting name." }, "type": "string", "required": true },
            { "name": "value", "description": { "zh": "Setting value.", "en": "Setting value." }, "type": "string", "required": true },
            { "name": "namespace", "description": { "zh": "Setting namespace.", "en": "Setting namespace." }, "type": "string", "required": false }
        ] },
        { "name": "install_app", "description": { "zh": "Install an APK.", "en": "Install an APK." }, "parameters": [
            { "name": "path", "description": { "zh": "APK file path.", "en": "APK file path." }, "type": "string", "required": true }
        ] },
        { "name": "uninstall_app", "description": { "zh": "Uninstall an app.", "en": "Uninstall an app." }, "parameters": [
            { "name": "package_name", "description": { "zh": "Application package name.", "en": "Application package name." }, "type": "string", "required": true },
            { "name": "keep_data", "description": { "zh": "Keep application data.", "en": "Keep application data." }, "type": "boolean", "required": false }
        ] },
        { "name": "list_installed_apps", "description": { "zh": "List installed apps.", "en": "List installed apps." }, "parameters": [
            { "name": "include_system_apps", "description": { "zh": "Include system apps.", "en": "Include system apps." }, "type": "boolean", "required": false }
        ] },
        { "name": "start_app", "description": { "zh": "Start an app.", "en": "Start an app." }, "parameters": [
            { "name": "package_name", "description": { "zh": "Application package name.", "en": "Application package name." }, "type": "string", "required": true },
            { "name": "activity", "description": { "zh": "Optional activity.", "en": "Optional activity." }, "type": "string", "required": false }
        ] },
        { "name": "stop_app", "description": { "zh": "Stop an app.", "en": "Stop an app." }, "parameters": [
            { "name": "package_name", "description": { "zh": "Application package name.", "en": "Application package name." }, "type": "string", "required": true }
        ] },
        { "name": "get_notifications", "description": { "zh": "Get device notifications.", "en": "Get device notifications." }, "parameters": [
            { "name": "limit", "description": { "zh": "Maximum number of entries.", "en": "Maximum number of entries." }, "type": "number", "required": false },
            { "name": "include_ongoing", "description": { "zh": "Include ongoing notifications.", "en": "Include ongoing notifications." }, "type": "boolean", "required": false }
        ] },
        { "name": "get_app_usage_time", "description": { "zh": "Get application foreground usage time.", "en": "Get application foreground usage time." }, "parameters": [
            { "name": "package_name", "description": { "zh": "Application package name.", "en": "Application package name." }, "type": "string", "required": false },
            { "name": "since_hours", "description": { "zh": "Lookback period in hours.", "en": "Lookback period in hours." }, "type": "number", "required": false },
            { "name": "limit", "description": { "zh": "Maximum number of entries.", "en": "Maximum number of entries." }, "type": "number", "required": false },
            { "name": "include_system_apps", "description": { "zh": "Include system apps.", "en": "Include system apps." }, "type": "boolean", "required": false }
        ] },
        { "name": "get_device_location", "description": { "zh": "Get device location.", "en": "Get device location." }, "parameters": [
            { "name": "high_accuracy", "description": { "zh": "Use high accuracy mode.", "en": "Use high accuracy mode." }, "type": "boolean", "required": false },
            { "name": "timeout", "description": { "zh": "Timeout in seconds.", "en": "Timeout in seconds." }, "type": "number", "required": false }
        ] },
        { "name": "request_bluetooth_permission", "description": { "zh": "Request Bluetooth permission.", "en": "Request Bluetooth permission." }, "parameters": [] },
        { "name": "get_bluetooth_state", "description": { "zh": "Get Bluetooth state.", "en": "Get Bluetooth state." }, "parameters": [] },
        { "name": "request_enable_bluetooth", "description": { "zh": "Request Bluetooth to be enabled.", "en": "Request Bluetooth to be enabled." }, "parameters": [] },
        { "name": "list_bluetooth_bonded_devices", "description": { "zh": "List bonded Bluetooth devices.", "en": "List bonded Bluetooth devices." }, "parameters": [] },
        { "name": "scan_bluetooth_devices", "description": { "zh": "Scan Bluetooth devices.", "en": "Scan Bluetooth devices." }, "parameters": [
            { "name": "duration_ms", "description": { "zh": "Scan duration in milliseconds.", "en": "Scan duration in milliseconds." }, "type": "number", "required": false },
            { "name": "include_ble", "description": { "zh": "Include BLE.", "en": "Include BLE." }, "type": "boolean", "required": false }
        ] },
        { "name": "bluetooth_connect", "description": { "zh": "Connect to a classic Bluetooth device.", "en": "Connect to a classic Bluetooth device." }, "parameters": [
            { "name": "address", "description": { "zh": "Bluetooth address.", "en": "Bluetooth address." }, "type": "string", "required": true },
            { "name": "uuid", "description": { "zh": "RFCOMM UUID。", "en": "RFCOMM UUID." }, "type": "string", "required": false }
        ] },
        { "name": "bluetooth_listen", "description": { "zh": "Listen for a classic Bluetooth connection.", "en": "Listen for a classic Bluetooth connection." }, "parameters": [
            { "name": "name", "description": { "zh": "Service name.", "en": "Service name." }, "type": "string", "required": false },
            { "name": "uuid", "description": { "zh": "RFCOMM UUID。", "en": "RFCOMM UUID." }, "type": "string", "required": false }
        ] },
        { "name": "bluetooth_accept", "description": { "zh": "Accept a Bluetooth connection.", "en": "Accept a Bluetooth connection." }, "parameters": [
            { "name": "listener_session_id", "description": { "zh": "Listener session ID.", "en": "Listener session ID." }, "type": "string", "required": true },
            { "name": "timeout_ms", "description": { "zh": "Wait time in milliseconds.", "en": "Wait time in milliseconds." }, "type": "number", "required": false }
        ] },
        { "name": "bluetooth_send", "description": { "zh": "Send Bluetooth data.", "en": "Send Bluetooth data." }, "parameters": [
            { "name": "session_id", "description": { "zh": "Session ID.", "en": "Session ID." }, "type": "string", "required": true },
            { "name": "text", "description": { "zh": "UTF-8 text.", "en": "UTF-8 text." }, "type": "string", "required": false },
            { "name": "data_base64", "description": { "zh": "Base64 bytes.", "en": "Base64 bytes." }, "type": "string", "required": false }
        ] },
        { "name": "bluetooth_read", "description": { "zh": "Read Bluetooth data.", "en": "Read Bluetooth data." }, "parameters": [
            { "name": "session_id", "description": { "zh": "Session ID.", "en": "Session ID." }, "type": "string", "required": true },
            { "name": "max_bytes", "description": { "zh": "Maximum bytes.", "en": "Maximum bytes." }, "type": "number", "required": false },
            { "name": "timeout_ms", "description": { "zh": "Wait time in milliseconds.", "en": "Wait time in milliseconds." }, "type": "number", "required": false }
        ] },
        { "name": "bluetooth_send_and_read", "description": { "zh": "Send and read Bluetooth data.", "en": "Send and read Bluetooth data." }, "parameters": [
            { "name": "session_id", "description": { "zh": "Session ID.", "en": "Session ID." }, "type": "string", "required": true },
            { "name": "text", "description": { "zh": "UTF-8 text.", "en": "UTF-8 text." }, "type": "string", "required": false },
            { "name": "data_base64", "description": { "zh": "Base64 bytes.", "en": "Base64 bytes." }, "type": "string", "required": false },
            { "name": "max_bytes", "description": { "zh": "Maximum bytes.", "en": "Maximum bytes." }, "type": "number", "required": false },
            { "name": "timeout_ms", "description": { "zh": "Wait time in milliseconds.", "en": "Wait time in milliseconds." }, "type": "number", "required": false }
        ] },
        { "name": "bluetooth_close", "description": { "zh": "Close a Bluetooth session.", "en": "Close a Bluetooth session." }, "parameters": [
            { "name": "session_id", "description": { "zh": "Session ID.", "en": "Session ID." }, "type": "string", "required": true }
        ] },
        { "name": "bluetooth_ble_connect", "description": { "zh": "Connect to a BLE device.", "en": "Connect to a BLE device." }, "parameters": [
            { "name": "address", "description": { "zh": "Bluetooth address.", "en": "Bluetooth address." }, "type": "string", "required": true },
            { "name": "auto_connect", "description": { "zh": "Use auto-connect.", "en": "Use auto-connect." }, "type": "boolean", "required": false }
        ] },
        { "name": "bluetooth_ble_discover_services", "description": { "zh": "Discover BLE services.", "en": "Discover BLE services." }, "parameters": [
            { "name": "session_id", "description": { "zh": "BLE session ID.", "en": "BLE session ID." }, "type": "string", "required": true },
            { "name": "timeout_ms", "description": { "zh": "Wait time in milliseconds.", "en": "Wait time in milliseconds." }, "type": "number", "required": false }
        ] },
        { "name": "bluetooth_ble_read_characteristic", "description": { "zh": "Read a BLE characteristic.", "en": "Read a BLE characteristic." }, "parameters": [
            { "name": "session_id", "description": { "zh": "BLE session ID.", "en": "BLE session ID." }, "type": "string", "required": true },
            { "name": "service_uuid", "description": { "zh": "Service UUID。", "en": "Service UUID." }, "type": "string", "required": true },
            { "name": "characteristic_uuid", "description": { "zh": "Characteristic UUID。", "en": "Characteristic UUID." }, "type": "string", "required": true },
            { "name": "timeout_ms", "description": { "zh": "Wait time in milliseconds.", "en": "Wait time in milliseconds." }, "type": "number", "required": false }
        ] },
        { "name": "bluetooth_ble_write_characteristic", "description": { "zh": "Write a BLE characteristic.", "en": "Write a BLE characteristic." }, "parameters": [
            { "name": "session_id", "description": { "zh": "BLE session ID.", "en": "BLE session ID." }, "type": "string", "required": true },
            { "name": "service_uuid", "description": { "zh": "Service UUID。", "en": "Service UUID." }, "type": "string", "required": true },
            { "name": "characteristic_uuid", "description": { "zh": "Characteristic UUID。", "en": "Characteristic UUID." }, "type": "string", "required": true },
            { "name": "text", "description": { "zh": "UTF-8 text.", "en": "UTF-8 text." }, "type": "string", "required": false },
            { "name": "data_base64", "description": { "zh": "Base64 bytes.", "en": "Base64 bytes." }, "type": "string", "required": false }
        ] },
        { "name": "bluetooth_ble_write_and_read_characteristic", "description": { "zh": "Write and read BLE characteristics.", "en": "Write and read BLE characteristics." }, "parameters": [
            { "name": "session_id", "description": { "zh": "BLE session ID.", "en": "BLE session ID." }, "type": "string", "required": true },
            { "name": "write_service_uuid", "description": { "zh": "Write service UUID.", "en": "Write service UUID." }, "type": "string", "required": true },
            { "name": "write_characteristic_uuid", "description": { "zh": "Write characteristic UUID.", "en": "Write characteristic UUID." }, "type": "string", "required": true },
            { "name": "read_service_uuid", "description": { "zh": "Read service UUID.", "en": "Read service UUID." }, "type": "string", "required": true },
            { "name": "read_characteristic_uuid", "description": { "zh": "Read characteristic UUID.", "en": "Read characteristic UUID." }, "type": "string", "required": true },
            { "name": "text", "description": { "zh": "UTF-8 text.", "en": "UTF-8 text." }, "type": "string", "required": false },
            { "name": "data_base64", "description": { "zh": "Base64 bytes.", "en": "Base64 bytes." }, "type": "string", "required": false },
            { "name": "timeout_ms", "description": { "zh": "Wait time in milliseconds.", "en": "Wait time in milliseconds." }, "type": "number", "required": false }
        ] },
        { "name": "bluetooth_ble_subscribe_characteristic", "description": { "zh": "Subscribe or unsubscribe a BLE characteristic.", "en": "Subscribe or unsubscribe a BLE characteristic." }, "parameters": [
            { "name": "session_id", "description": { "zh": "BLE session ID.", "en": "BLE session ID." }, "type": "string", "required": true },
            { "name": "service_uuid", "description": { "zh": "Service UUID。", "en": "Service UUID." }, "type": "string", "required": true },
            { "name": "characteristic_uuid", "description": { "zh": "Characteristic UUID。", "en": "Characteristic UUID." }, "type": "string", "required": true },
            { "name": "enable", "description": { "zh": "Whether to subscribe.", "en": "Whether to subscribe." }, "type": "boolean", "required": false }
        ] },
        { "name": "bluetooth_ble_read_notifications", "description": { "zh": "Read BLE notifications.", "en": "Read BLE notifications." }, "parameters": [
            { "name": "session_id", "description": { "zh": "BLE session ID.", "en": "BLE session ID." }, "type": "string", "required": true },
            { "name": "limit", "description": { "zh": "Number of notifications.", "en": "Number of notifications." }, "type": "number", "required": false }
        ] },
        { "name": "get_device_info", "description": { "zh": "Get detailed device information.", "en": "Get detailed device information." }, "parameters": [] }
    ]
}
*/

type ToolResponse = {
    success: boolean;
    message: string;
    data?: unknown;
};

type EmptyParams = Record<string, never>;
type UsageParams = {
    package_name?: string;
    since_hours?: number;
    limit?: number;
    include_system_apps?: boolean;
};
type ScanParams = { duration_ms?: number | string; include_ble?: boolean };
type ConnectParams = { address: string; uuid?: string };
type ListenParams = { name?: string; uuid?: string };
type AcceptParams = { listener_session_id: string; timeout_ms?: number | string };
type PayloadParams = { session_id: string; text?: string; data_base64?: string };
type ReadParams = { session_id: string; max_bytes?: number | string; timeout_ms?: number | string };
type SendAndReadParams = PayloadParams & { max_bytes?: number | string; timeout_ms?: number | string };
type BleConnectParams = { address: string; auto_connect?: boolean };
type BleDiscoverParams = { session_id: string; timeout_ms?: number | string };
type BleCharacteristicParams = {
    session_id: string;
    service_uuid: string;
    characteristic_uuid: string;
    timeout_ms?: number | string;
};
type BleWriteParams = Omit<BleCharacteristicParams, "timeout_ms"> & { text?: string; data_base64?: string };
type BleWriteAndReadParams = {
    session_id: string;
    write_service_uuid: string;
    write_characteristic_uuid: string;
    read_service_uuid: string;
    read_characteristic_uuid: string;
    text?: string;
    data_base64?: string;
    timeout_ms?: number | string;
};
type BleSubscribeParams = Omit<BleCharacteristicParams, "timeout_ms"> & { enable?: boolean };
type BleReadNotificationsParams = { session_id: string; limit?: number | string };

/** Gets a system setting through the shared host API. */
async function get_system_setting(params: { setting: string; namespace?: string }): Promise<ToolResponse> {
    const result = await Tools.System.getSetting(params.setting, params.namespace ?? "system");
    return { success: true, message: "Successfully retrieved system setting", data: result };
}

/** Modifies a system setting through the shared host API. */
async function modify_system_setting(params: { setting: string; value: string; namespace?: string }): Promise<ToolResponse> {
    const result = await Tools.System.setSetting(params.setting, params.value, params.namespace ?? "system");
    const success = result.value === params.value;
    return { success, message: success ? "Successfully modified system setting" : "Failed to modify system setting", data: result };
}

/** Installs an application from an APK path. */
async function install_app(params: { path: string }): Promise<ToolResponse> {
    const result = await Tools.System.installApp(params.path);
    return { success: result.success, message: result.success ? "App installed successfully" : "Failed to install app", data: result };
}

/** Uninstalls an application by package name. */
async function uninstall_app(params: { package_name: string; keep_data?: boolean }): Promise<ToolResponse> {
    const result = await Tools.System.uninstallApp(params.package_name);
    return { success: result.success, message: result.success ? "App uninstalled successfully" : "Failed to uninstall app", data: result };
}

/** Lists installed applications. */
async function list_installed_apps(params: { include_system_apps?: boolean }): Promise<ToolResponse> {
    const result = await Tools.System.listApps(params.include_system_apps ?? false);
    return { success: true, message: "Successfully retrieved app list", data: result };
}

/** Starts an application by package name. */
async function start_app(params: { package_name: string; activity?: string }): Promise<ToolResponse> {
    const result = await Tools.System.startApp(params.package_name, params.activity);
    return { success: result.success, message: result.success ? "App started successfully" : "Failed to start app", data: result };
}

/** Stops an application by package name. */
async function stop_app(params: { package_name: string }): Promise<ToolResponse> {
    const result = await Tools.System.stopApp(params.package_name);
    return { success: result.success, message: result.success ? "App stopped successfully" : "Failed to stop app", data: result };
}

/** Gets device notifications. */
async function get_notifications(params: { limit?: number; include_ongoing?: boolean }): Promise<ToolResponse> {
    const result = await Tools.System.getNotifications(params.limit ?? 10, params.include_ongoing ?? false);
    return { success: true, message: "Successfully retrieved notifications", data: result };
}

/** Gets application foreground usage time. */
async function get_app_usage_time(params: UsageParams): Promise<ToolResponse> {
    const result = await Tools.System.getAppUsageTime({
        packageName: params.package_name,
        sinceHours: params.since_hours ?? 24,
        limit: params.limit ?? 10,
        includeSystemApps: params.include_system_apps ?? false,
    });
    return { success: true, message: "Successfully retrieved app usage time", data: result };
}

/** Gets the current device location. */
async function get_device_location(params: { high_accuracy?: boolean; timeout?: number }): Promise<ToolResponse> {
    const result = await Tools.System.getLocation(params.high_accuracy ?? false, params.timeout ?? 10);
    return { success: true, message: "Successfully retrieved location", data: result };
}

/** Requests Bluetooth nearby-device permission. */
async function request_bluetooth_permission(_params: EmptyParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.requestPermission();
    return { success: true, message: "Successfully requested Bluetooth permission", data: result };
}

/** Gets the Bluetooth adapter state. */
async function get_bluetooth_state(_params: EmptyParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.getState();
    return { success: true, message: "Successfully retrieved Bluetooth state", data: result };
}

/** Requests the system Bluetooth enable dialog. */
async function request_enable_bluetooth(_params: EmptyParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.requestEnable();
    return { success: true, message: "Bluetooth enable request opened", data: result };
}

/** Lists bonded Bluetooth devices. */
async function list_bluetooth_bonded_devices(_params: EmptyParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.listBondedDevices();
    return { success: true, message: "Successfully retrieved bonded Bluetooth devices", data: result };
}

/** Scans nearby classic Bluetooth and BLE devices. */
async function scan_bluetooth_devices(params: ScanParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.scan({ durationMs: params.duration_ms, includeBle: params.include_ble });
    return { success: true, message: "Successfully scanned Bluetooth devices", data: result };
}

/** Connects to a classic Bluetooth device. */
async function bluetooth_connect(params: ConnectParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.connect({ address: params.address, uuid: params.uuid });
    return { success: true, message: "Successfully connected to Bluetooth device", data: result };
}

/** Opens a classic Bluetooth listener. */
async function bluetooth_listen(params: ListenParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.listen({ name: params.name, uuid: params.uuid });
    return { success: true, message: "Successfully created Bluetooth listener", data: result };
}

/** Accepts an incoming classic Bluetooth connection. */
async function bluetooth_accept(params: AcceptParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.accept(params.listener_session_id, params.timeout_ms);
    return { success: true, message: "Successfully accepted Bluetooth connection", data: result };
}

/** Sends text or Base64 bytes over a classic Bluetooth session. */
async function bluetooth_send(params: PayloadParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.send(params.session_id, { text: params.text, dataBase64: params.data_base64 });
    return { success: true, message: "Successfully sent Bluetooth data", data: result };
}

/** Reads data from a classic Bluetooth session. */
async function bluetooth_read(params: ReadParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.read(params.session_id, { maxBytes: params.max_bytes, timeoutMs: params.timeout_ms });
    return { success: true, message: "Successfully read Bluetooth data", data: result };
}

/** Sends data and reads the response from a classic Bluetooth session. */
async function bluetooth_send_and_read(params: SendAndReadParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.sendAndRead(params.session_id, {
        text: params.text,
        dataBase64: params.data_base64,
        maxBytes: params.max_bytes,
        timeoutMs: params.timeout_ms,
    });
    return { success: true, message: "Successfully sent and read Bluetooth data", data: result };
}

/** Closes a Bluetooth or BLE session. */
async function bluetooth_close(params: { session_id: string }): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.close(params.session_id);
    return { success: true, message: "Successfully closed Bluetooth session", data: result };
}

/** Connects to a BLE device. */
async function bluetooth_ble_connect(params: BleConnectParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.ble.connect({ address: params.address, autoConnect: params.auto_connect });
    return { success: true, message: "Successfully connected to BLE device", data: result };
}

/** Discovers services and characteristics on a BLE session. */
async function bluetooth_ble_discover_services(params: BleDiscoverParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.ble.discoverServices(params.session_id, params.timeout_ms);
    return { success: true, message: "Successfully discovered BLE services", data: result };
}

/** Reads a BLE characteristic. */
async function bluetooth_ble_read_characteristic(params: BleCharacteristicParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.ble.readCharacteristic(params.session_id, {
        serviceUuid: params.service_uuid,
        characteristicUuid: params.characteristic_uuid,
        timeoutMs: params.timeout_ms,
    });
    return { success: true, message: "Successfully read BLE characteristic", data: result };
}

/** Writes text or Base64 bytes to a BLE characteristic. */
async function bluetooth_ble_write_characteristic(params: BleWriteParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.ble.writeCharacteristic(params.session_id, {
        serviceUuid: params.service_uuid,
        characteristicUuid: params.characteristic_uuid,
        text: params.text,
        dataBase64: params.data_base64,
    });
    return { success: true, message: "Successfully wrote BLE characteristic", data: result };
}

/** Writes to one BLE characteristic and reads another characteristic. */
async function bluetooth_ble_write_and_read_characteristic(params: BleWriteAndReadParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.ble.writeAndReadCharacteristic(params.session_id, {
        writeServiceUuid: params.write_service_uuid,
        writeCharacteristicUuid: params.write_characteristic_uuid,
        readServiceUuid: params.read_service_uuid,
        readCharacteristicUuid: params.read_characteristic_uuid,
        text: params.text,
        dataBase64: params.data_base64,
        timeoutMs: params.timeout_ms,
    });
    return { success: true, message: "Successfully wrote and read BLE characteristic", data: result };
}

/** Enables or disables BLE characteristic notifications. */
async function bluetooth_ble_subscribe_characteristic(params: BleSubscribeParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.ble.subscribe(params.session_id, {
        serviceUuid: params.service_uuid,
        characteristicUuid: params.characteristic_uuid,
        enable: params.enable,
    });
    return { success: true, message: "Successfully updated BLE subscription", data: result };
}

/** Reads queued BLE notifications. */
async function bluetooth_ble_read_notifications(params: BleReadNotificationsParams): Promise<ToolResponse> {
    const result = await Tools.System.bluetooth.ble.readNotifications(params.session_id, params.limit);
    return { success: true, message: "Successfully read BLE notifications", data: result };
}

/** Gets detailed device information. */
async function get_device_info(_params: EmptyParams): Promise<ToolResponse> {
    const result = await Tools.System.getDeviceInfo();
    return { success: true, message: "Successfully retrieved device info", data: result };
}

/** Completes a package tool call and reports unexpected errors. */
async function completeTool<P>(func: (params: P) => Promise<ToolResponse>, params: P): Promise<void> {
    try {
        complete(await func(params));
    } catch (error: any) {
        console.error(`Tool ${func.name} failed unexpectedly`, error);
        complete({ success: false, message: `Unexpected error while executing tool: ${error.message}` });
    }
}

/** Reports that the system tools package is loaded. */
async function main(): Promise<void> {
    complete({ success: true, message: "System tools package loaded" });
}

exports.get_system_setting = (params: { setting: string; namespace?: string }) => completeTool(get_system_setting, params);
exports.modify_system_setting = (params: { setting: string; value: string; namespace?: string }) => completeTool(modify_system_setting, params);
exports.install_app = (params: { path: string }) => completeTool(install_app, params);
exports.uninstall_app = (params: { package_name: string; keep_data?: boolean }) => completeTool(uninstall_app, params);
exports.list_installed_apps = (params: { include_system_apps?: boolean }) => completeTool(list_installed_apps, params);
exports.start_app = (params: { package_name: string; activity?: string }) => completeTool(start_app, params);
exports.stop_app = (params: { package_name: string }) => completeTool(stop_app, params);
exports.get_notifications = (params: { limit?: number; include_ongoing?: boolean }) => completeTool(get_notifications, params);
exports.get_app_usage_time = (params: UsageParams) => completeTool(get_app_usage_time, params);
exports.get_device_location = (params: { high_accuracy?: boolean; timeout?: number }) => completeTool(get_device_location, params);
exports.request_bluetooth_permission = (params: EmptyParams) => completeTool(request_bluetooth_permission, params);
exports.get_bluetooth_state = (params: EmptyParams) => completeTool(get_bluetooth_state, params);
exports.request_enable_bluetooth = (params: EmptyParams) => completeTool(request_enable_bluetooth, params);
exports.list_bluetooth_bonded_devices = (params: EmptyParams) => completeTool(list_bluetooth_bonded_devices, params);
exports.scan_bluetooth_devices = (params: ScanParams) => completeTool(scan_bluetooth_devices, params);
exports.bluetooth_connect = (params: ConnectParams) => completeTool(bluetooth_connect, params);
exports.bluetooth_listen = (params: ListenParams) => completeTool(bluetooth_listen, params);
exports.bluetooth_accept = (params: AcceptParams) => completeTool(bluetooth_accept, params);
exports.bluetooth_send = (params: PayloadParams) => completeTool(bluetooth_send, params);
exports.bluetooth_read = (params: ReadParams) => completeTool(bluetooth_read, params);
exports.bluetooth_send_and_read = (params: SendAndReadParams) => completeTool(bluetooth_send_and_read, params);
exports.bluetooth_close = (params: { session_id: string }) => completeTool(bluetooth_close, params);
exports.bluetooth_ble_connect = (params: BleConnectParams) => completeTool(bluetooth_ble_connect, params);
exports.bluetooth_ble_discover_services = (params: BleDiscoverParams) => completeTool(bluetooth_ble_discover_services, params);
exports.bluetooth_ble_read_characteristic = (params: BleCharacteristicParams) => completeTool(bluetooth_ble_read_characteristic, params);
exports.bluetooth_ble_write_characteristic = (params: BleWriteParams) => completeTool(bluetooth_ble_write_characteristic, params);
exports.bluetooth_ble_write_and_read_characteristic = (params: BleWriteAndReadParams) => completeTool(bluetooth_ble_write_and_read_characteristic, params);
exports.bluetooth_ble_subscribe_characteristic = (params: BleSubscribeParams) => completeTool(bluetooth_ble_subscribe_characteristic, params);
exports.bluetooth_ble_read_notifications = (params: BleReadNotificationsParams) => completeTool(bluetooth_ble_read_notifications, params);
exports.get_device_info = (params: EmptyParams) => completeTool(get_device_info, params);
exports.main = main;
