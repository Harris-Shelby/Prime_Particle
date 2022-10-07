import axios from 'axios';
import { showAlert } from './alerts';

export const uploadEpaperImg = async (data) => {
	try {
		const url = 'https://sakura.qsomula.top/api/v1/EpaperImg/uploadImg';

		const res = await axios({
			method: 'PATCH',
			url,
			data,
		});

		if (res.data.status === 'success') {
			showAlert('success', `updated successerfully!`);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};
