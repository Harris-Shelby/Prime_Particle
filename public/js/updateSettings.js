import axios from 'axios';
import { showAlert } from './alerts';

export const updateSetting = async (data, type) => {
	try {
		const url =
			type === 'password'
				? 'https://sakura.qsomula.top/api/v1/users/updateMyPassword'
				: 'https://sakura.qsomula.top/api/v1/users/updateMe';

		const res = await axios({
			method: 'PATCH',
			url,
			data,
		});

		if (res.data.status === 'success') {
			showAlert('success', `${type.toUpperCase()} updated successerfully!`);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};
