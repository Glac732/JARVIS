# BREACH original asset production brief

## Target pipeline

- Author in Blender (or equivalent DCC).
- Export glTF 2.0 / GLB.
- Load using Three.js GLTFLoader.
- Keep game units in metres; character height target approximately 1.75 m.
- Apply PBR materials with packed metallic/roughness channels where appropriate.
- Include named mesh nodes, origin/pivot placement, collision proxy guidance and LODs.
- Avoid shipping unlicensed game rips, ripped textures, logos or character likenesses.

## First-person weapon asset specification

For each weapon:
- Separate receiver, barrel, handguard, optic rail, magazine, stock and attachment sockets where practical.
- Place the firing origin at the muzzle and the reload interaction pivot at the magazine.
- Provide a consistent first-person grip origin and a third-person carry origin.
- Include material variants and LOD0/LOD1/LOD2.
- Keep high-detail geometry and texture sizes within a documented GPU budget.
- Required animation clips: idle, fire, reload, inspect and ADS transition.

## Operator asset specification

- Original, non-derivative silhouette and equipment design.
- Separate head, torso, arms, hands, legs, boots, helmet and gear where animation needs them.
- Rig to a documented humanoid skeleton.
- Required clips: idle, walk, sprint, crouch, jump, aim, fire, reload, hit reaction and elimination.
- Include neutral and team color variants through materials, not duplicated meshes.

## OUTPOST environment kit

Create modular original assets for:
- Concrete barriers, sandbag walls, shipping containers and doors.
- Watchtower, communications dish, antenna array and utility poles.
- Crates, barrels, cable reels, generators and field equipment.
- Rocks, ground debris, terrain material, decals and impact marks.
- Collision proxies separate from visual meshes.

## Current status

The existing client uses procedural Three.js primitives for its characters, weapons and map. This document is a production brief, not a claim that these authored assets have already been created. Asset files should only be marked complete after they are committed and load-tested in the game.
