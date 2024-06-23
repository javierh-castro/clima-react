import { ChangeEvent, FormEvent, useState } from "react";
import { countries } from "../../data/countries";
import styles from "./Form.module.css";
import type { SearchType } from "../../types";
import Alert from "../Alert/Alert";


type FormProps = {
  fetchWeather: (buscar: SearchType) => Promise<void>
}

function Form({fetchWeather}: FormProps) {
  const [buscar, setBuscar] = useState<SearchType>({
    city: "",
    country: "",
  });
  const [alert, setAlert] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    setBuscar({
      ...buscar,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (Object.values(buscar).includes('')) {
      setAlert('Falta completar campos...')
      return
    }

    fetchWeather(buscar)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {alert && <Alert>{alert}</Alert>}
      <div className={styles.field}>
        <label htmlFor="city">Ciudad: </label>
        <input
          type="text"
          name="city"
          id="city"
          placeholder="Ciudad"
          value={buscar.city}
          onChange={handleChange}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="country">País: </label>
        <select
          id="country"
          name="country"
          value={buscar.country}
          onChange={handleChange}
        >
          <option value="">-- Seleccione un País --</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <input className={styles.submit} type="submit" value="Consultar Clima" />
    </form>
  );
}

export default Form;
