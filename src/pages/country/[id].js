import { useState, useEffect } from 'react'
import Layout from '../../Components/Layout/Layout'
import styles from './Country.module.css'

const getCountry = async (id) => {
	const res = await fetch(`https://restcountries.eu/rest/v2/alpha/${id}`);

	const country = await res.json();

	return country;
}

const Country = ({ country }) => {
	const [borders, setBorders] = useState([]);

	const getBorders = async () => {
		const borders = await Promise.all(
			country.borders.map((border) => getCountry(border))
		)
		setBorders(borders);
	}

	useEffect(() => {
		getBorders();
	}, [])

	console.log(borders)
	return (
		<Layout title={country.name}>
			<div className={styles.container}>
				<div className={styles.left_content}>
					<div className={styles.overview_panel}>
						<img src={country.flag} alt={country.name} />
						<h1 className={styles.overview_name}>{country.name}</h1>
						<div className={styles.overview_region}>{country.region}</div>

						<div className={styles.overview_numbers}>
							<div className={styles.overview_population}>
								<div className={styles.overview_value}>{country.population}</div>
								<div className={styles.overview_label}>Population</div>
							</div>

							<div className={styles.overview_area}>
								<div className={styles.overview_value}>{country.area}</div>
								<div className={styles.overview_label}>Area</div>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.right_content}>
					<div className={styles.details_panel}>
						<h4 className={styles.details_panel_heading}>Details</h4>
						<div className={styles.details_panel_row}>
							<div className={styles.details_panel_label}>Capital</div>
							<div className={styles.details_panel_value}>{country.capital}</div>
						</div>

						<div className={styles.details_panel_row}>
							<div className={styles.details_panel_label}>SubRegion</div>
							<div className={styles.details_panel_value}>{country.subregion}</div>
						</div>

						<div className={styles.details_panel_row}>
							<div className={styles.details_panel_label}>Languages</div>
							<div className={styles.details_panel_value}>
								{country.languages.map(({ name }) => name).join(", ")}
							</div>
						</div>

						<div className={styles.details_panel_row}>
							<div className={styles.details_panel_label}>Currencies</div>
							<div className={styles.details_panel_value}>
								{country.currencies.map(({ name }) => name).join(", ")}
							</div>
						</div>

						<div className={styles.details_panel_row}>
							<div className={styles.details_panel_label}>Native Name</div>
							<div className={styles.details_panel_value}>{country.nativeName}</div>
						</div>

						<div className={styles.details_panel_row}>
							<div className={styles.details_panel_label}>Gini</div>
							<div className={styles.details_panel_value}>{country.gini}%</div>
						</div>

						<div className={styles.details_panel_row}>
							<div className={styles.details_panel_label}>Timezones</div>
							<div className={styles.details_panel_value}>
								{country.timezones.map((time) => time)}
							</div>
						</div>

						<div className={styles.details_panel_borders}>
							<div className={styles.details_panel_borders_label}>Neighbouring Countries</div>
							<div className={styles.details_panel_borders_container}>
								{borders.map(({ flag, name }, index) => (
									<div className={styles.details_panel_border_country} key={index}>
										<img src={flag} alt={name} />

										<div className={styles.details_panel_border_name}>{name}</div>
									</div>
								))}
							</div>

						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
export default Country
export const getStaticPaths = async () => {
	const res = await fetch(`https://restcountries.eu/rest/v2/all`);
	const countries = await res.json();

	const paths = countries.map((country) => ({
		params: {id: country.alpha3Code}
	}));
	
	return {
		paths,
		fallback: false
	}
}
export const getStaticProps = async ({ params }) => {

	const country = await getCountry(params.id)

	return {
		props: {
			country,
		}
	}
}