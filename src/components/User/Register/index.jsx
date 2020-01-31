// Dependencies
import React, { useState } from 'react';
import objectAssign from 'object-assign';

// Resources
import { Steps } from 'primereact/steps';
import PersonalInfo from './PersonalInfo';
import Verify from './Verify';
import Aditional from './Aditional';
import styles from './styles.module.css';

const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    docNumber: '',
    cellphone: '',
    code: '',
    businessName: '',
    businessNumber: '',
    password: '',
    confirmPassword: '',
  });
  const registerSteps = [
    { label: 'Datos', className: 'text--small' },
    { label: 'Adicionales', className: 'text--small' },
    { label: 'Verificación', className: 'text--small' },
  ];
  const [stepsIndex, setStepsIndex] = useState(0);

  const nextStep = () => {
    setStepsIndex(stepsIndex + 1);
  };

  const previousStep = () => {
    setStepsIndex(stepsIndex - 1);
  };

  const saveValues = (values) => {
    setData(objectAssign({}, data, values));
    nextStep();
  };

  const registerFlow = () => {
    switch (stepsIndex) {
      case 0:
        return (
          <PersonalInfo
            data={data}
            saveValues={saveValues}
          />
        );
      case 1:
        return (
          <Aditional
            data={data}
            previousStep={previousStep}
            saveValues={saveValues}
            setData={setData}
          />
        );
      case 2:
        return (
          <Verify
            data={data}
            previousStep={previousStep}
            saveValues={saveValues}
          />
        );
      default:
        return null;
    }
  };
  return (
    <>
      <div className={`${styles.jumbotron} p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4`}>
        {registerFlow()}
      </div>
      {
        stepsIndex < 3 && (
          <div className="p-col-12 p-sm-11 p-md-9 p-lg-8 p-xl-6">
            <Steps className="steps--register" activeIndex={stepsIndex} model={registerSteps} />
          </div>
        )
      }
    </>
  );
};

export default Register;
