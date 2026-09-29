# Device Space Visualization

`RuntimeSettingsPanel.dart` owns the device space data and actions, while
`DeviceSpaceGraph.dart` presents the interaction. Layout and canvas painting live in
`DeviceSpaceGraphLayout.dart` and `DeviceSpaceGraphPainter.dart`, reusing the existing Core
topology projection and disconnect interfaces. `DeviceSpaceGraphSphere.dart` renders the
spherical material and embossed device symbols of the circular nodes.

By default the graph shows device relationships: the current device sits at the center and the
remaining space members slowly orbit along a tilted ellipse, roughly 28 seconds per revolution.
Perspective projection, larger-nearer scaling, dimmer-farther fading, and depth-sorted occlusion
produce a pseudo-3D effect. With many devices they spread across several orbits.
Relationship guide lines follow the nodes and express space membership only, not an established
direct connection. The total device count and the online count are shown directly in the graph
header; nodes keep only a circular icon, a status dot, and the center-switch badge.

Names, status, or action text do not permanently sit below the nodes. Desktop hover and keyboard
focus reveal the name, online status, and platform; tapping any node expands the device details
below the graph, and touch devices view them by tapping as well. Hovering, keyboard focus, or
viewing remote details pauses the orbit, which resumes from the same angle afterwards.

Center and outer nodes share the spherical material: directional highlight, shadow, rim light, and
contact shadow build volume; spheres desaturate the theme color and use a semi-transparent
material so orbits and background show through faintly. Dark mode keeps the night-sky layering,
while light mode lowers the white highlight so the surface is not washed out. Device symbols read
as embossed relief on the sphere through thickness, bevel, surface gradient, and a separate
shadow. Outer symbols keep a recognizable front face and tilt only slightly with the orbit angle;
the light and specular positions share the same orbit phase. They lift on hover or selection and
press back down on press; with reduced motion the static state is applied directly.

Tapping the current device shows its details and expands the connection topology in the same
canvas; tapping again returns. The orbit angle is frozen during the view switch and topology nodes
stay still. The topology layers by the recorded connection distance, expanding left to right when
horizontal space is plentiful and top to bottom on narrow screens. Members without a connection
path are arranged separately, and no lines are fabricated. Online connections are solid, while
offline, unknown, and version-mismatched connections use differently colored dashed lines; the
flowing highlight means the link is online, not that traffic is real time.

Tapping a node expands the device name, online status, platform, Core version, neighboring
devices, and connection reason below the graph. The disconnect action appears only when the
selected device and the current device have a connection record, and it keeps the confirmation
step, the disabled state during execution, and error messages. Tapping empty space or the close
button collapses the details.

Device nodes are uniformly circular and support hover, press, and keyboard focus. The canvas
position is fixed: no dragging, pinch zoom, wheel zoom, or reset. The center sphere, outer
spheres, orbit radii, and strokes all scale continuously with the current canvas short side, and
both views use the same canvas size. Dragging on the graph is left to the outer page scroll.

Narrow screens tighten card padding and copy, and the graph height follows the window ratio; node
diameter, icon, status dot, and orbit stroke width are not hardcoded to a wide/narrow pair. The
canvas bounds cover a complete orbit cycle, so device rotation never changes the overall size.
Nodes reuse one component and only update position, scale, opacity, and occlusion order; node
materials are repainted separately, device symbols reuse layers, and the settings page is not
rebuilt every frame. Glow, orbits, and online links are repainted by a separate canvas. Enabling
the system reduce-motion setting stops the orbit and continuous effects while keeping the static
graph and every action.

Manual verification focus: a single device, one offline member, multiple members with indirect
connections; rapid round trips between both views; bounds and front/back occlusion across a full
orbit cycle; pausing and resuming around hover, tap, and collapsing details; window resizing,
narrow screens, and light/dark themes; dragging and pinching not moving the canvas while graph
swipes scroll the page; device details and disconnect failure messages; keyboard focus order and
the system reduce-motion setting; sphere highlight and device symbol contrast in both themes, plus
relief legibility on compact nodes.
