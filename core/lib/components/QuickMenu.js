import { Component } from '../Component';
import { Monogatari } from '../monogatari';
import { $_ } from '@aegis-framework/artemis';

class QuickMenu extends Component {

	static html (html = null) {
		if (html !== null) {
			QuickMenu._html = html;
		} else {
			return QuickMenu._html;
		}
	}

	static setup () {
		QuickMenu.render ();
		return Promise.resolve ();
	}

	static add ({ string, icon, data, ...rest }) {
		QuickMenu._configuration.buttons.push ({
			string,
			icon,
			data,
			...rest
		});
		QuickMenu.render ();
	}

	static addAfter (after, { string, icon, data, ...rest }) {
		let index = null;
		for (let i = 0; i < QuickMenu._configuration.buttons.length; i++) {
			const button = QuickMenu._configuration.buttons[i];
			if (button.string === after) {
				index = i + 1;
				break;
			}
		}
		if (index !== null) {
			QuickMenu._configuration.buttons.splice (index, 0, {
				string,
				icon,
				data,
				...rest
			});
		}
	}

	static addBefore (before, { string, icon, data, ...rest }) {
		let index = null;
		for (let i = 0; i < QuickMenu._configuration.buttons.length; i++) {
			const button = QuickMenu._configuration.buttons[i];
			if (button.string === before) {
				index = i;
				break;
			}
		}
		if (index !== null) {
			QuickMenu._configuration.buttons.splice (index, 0, {
				string,
				icon,
				data,
				...rest
			});
		}
	}

	static remove (string) {
		QuickMenu._configuration.buttons.filter ((button) => button.string !== string);
		QuickMenu.render ();
	}

	static buttons () {

	}

	static button (string) {
		return QuickMenu._configuration.buttons.find ((button) => button.string === string);
	}

	static render () {
		$_(`${Monogatari.selector} #game [data-ui="quick-menu"]`).html ('');
		$_(`${Monogatari.selector} #game [data-ui="quick-menu"]`).html (QuickMenu._configuration.buttons.map ((button) => {
			const data = Object.keys (button.data).map ((key) => `data-${key}="${button.data[key]}"`).join (' ');

			return `<button ${data}>
						<span class="${button.icon}" ${data}></span>
						<span data-string="${button.string}" ${data}>${Monogatari.string (button.string)}</span>
					</button>`;
		}).join (' '));
	}
}

QuickMenu._configuration = {
	buttons: [
		{
			string: 'Back',
			icon: 'fas fa-arrow-left',
			data: {
				action: 'back'
			}
		},
		{
			string: 'Hide',
			icon: 'fas fa-eye',
			data: {
				action: 'distraction-free'
			}
		},
		{
			string: 'AutoPlay',
			icon: 'fas fa-play-circle',
			data: {
				action: 'auto-play'
			}
		},
		{
			string: 'Save',
			icon: 'fas fa-save',
			data: {
				action: 'open-menu',
				open: 'save'
			}
		},
		{
			string: 'Load',
			icon: 'fas fa-undo',
			data: {
				action: 'open-menu',
				open: 'load'
			}
		},
		{
			string: 'Settings',
			icon: 'fas fa-cog',
			data: {
				action: 'open-menu',
				open: 'settings'
			}
		},
		{
			string: 'Quit',
			icon: 'fas fa-times-circle',
			data: {
				action: 'end'
			}
		}
	]
};
QuickMenu._state = {};
QuickMenu._id = 'QuickMenu';

QuickMenu._html = '';

Monogatari.registerComponent (QuickMenu);