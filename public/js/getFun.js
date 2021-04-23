import axios from 'axios';
import { showAlert } from './alerts';

export const getAccesser = async (id) => {
	try {
		const res = await axios({
			method: 'GET',
			url: `http://penguin.linux.test:4000/api/v1/accessers/daily-stats/${id}`,
		});

		if (res.data.status === 'success') {
			return res.data.data.stats;
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};
