import { useEffect, useState } from "react";
import { Vector3 } from "three";

const useControls = (vehicleApi, chassisApi) => {
  const [controls, setControls] = useState({});

  useEffect(() => {
    const handleKeyDown = (event) => {
      setControls((prev) => ({ ...prev, [event.code]: true }));
    };
    const handleKeyUp = (event) => {
      setControls((prev) => ({ ...prev, [event.code]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!vehicleApi || !chassisApi) return;

    const baseForce = 200;
    const turboMultiplier = controls.ShiftLeft ? 1.5 : 1;
    const engineForce = baseForce * turboMultiplier;

    const frontSteering = 0.8;
    const backSteering = 0.2;

    // Merge WASD and Arrow keys for same behavior
    const forward = controls.KeyW || controls.ArrowUp;
    const backward = controls.KeyS || controls.ArrowDown;
    const left = controls.KeyA || controls.ArrowLeft;
    const right = controls.KeyD || controls.ArrowRight;

    // Drive
    if (forward) {
      vehicleApi.applyEngineForce(-engineForce, 2);
      vehicleApi.applyEngineForce(-engineForce, 3);
    } else if (backward) {
      vehicleApi.applyEngineForce(engineForce * 0.9, 2);
      vehicleApi.applyEngineForce(engineForce * 0.9, 3);
    } else {
      vehicleApi.applyEngineForce(0, 2);
      vehicleApi.applyEngineForce(0, 3);
    }

    // Braking
    if (controls.Space) {
      for (let i = 0; i < 4; i++) vehicleApi.setBrake(5, i);
    } else {
      for (let i = 0; i < 4; i++) vehicleApi.setBrake(0, i);
    }

    // Steering
    if (left) {
      vehicleApi.setSteeringValue(frontSteering, 0);
      vehicleApi.setSteeringValue(frontSteering, 1);
      vehicleApi.setSteeringValue(-backSteering, 2);
      vehicleApi.setSteeringValue(-backSteering, 3);
    } else if (right) {
      vehicleApi.setSteeringValue(-frontSteering, 0);
      vehicleApi.setSteeringValue(-frontSteering, 1);
      vehicleApi.setSteeringValue(backSteering, 2);
      vehicleApi.setSteeringValue(backSteering, 3);
    } else {
      for (let i = 0; i < 4; i++) vehicleApi.setSteeringValue(0, i);
    }

    // Reset
    if (controls.KeyR) {
      chassisApi.position.set(-10, 1, -3);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      chassisApi.rotation.set(0, Math.PI / 2, 0);
    }
  });
};

export default useControls;
