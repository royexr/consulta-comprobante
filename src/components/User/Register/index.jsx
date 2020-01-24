// Dependencies
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import objectAssign from 'object-assign';

// Resources
import { Steps } from 'primereact/steps';
import PersonalInfo from './PersonalInfo';
import Verify from './Verify';
import Aditional from './Aditional';
import Finished from './Finished';
import api from '../../../utils/api';
import styles from './styles.module.css';

const Register = () => {
  const [data, setData] = useState({});
  // let data = {
  //   name: '',
  //   email: '',
  //   docNumber: '',
  //   cellphone: '',
  // };
  const registerSteps = [
    { label: 'Datos', className: 'text--small' },
    { label: 'Verificación', className: 'text--small' },
    { label: 'Adicionales', className: 'text--small' },
    { label: 'Finalizado', className: 'text--small' },
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
    console.log(data.constructor);
    nextStep();
  };

  const registerFlow = () => {
    switch (stepsIndex) {
      case 0:
        return (
          <PersonalInfo
            saveValues={saveValues}
          />
        );
      case 1:
        return (
          <Verify
            data={data}
            previousStep={previousStep}
            saveValues={saveValues}
          />
        );
      case 2:
        return <Aditional />;
      case 3:
        return <Finished />;
      default:
        return null;
    }
  };
  return (
    <>
      <div className={`${styles.jumbotron} p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4`}>
        {registerFlow()}
      </div>
      <div className="p-col-12 p-sm-11 p-md-9 p-lg-8 p-xl-6">
        <Steps activeIndex={stepsIndex} model={registerSteps} />
      </div>
    </>
  );
};

export default Register;
