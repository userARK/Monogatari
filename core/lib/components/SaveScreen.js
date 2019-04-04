import { Component } from '../Component';
import { Monogatari } from '../monogatari';
import { $_ } from '@aegis-framework/artemis';

class SaveScreen extends Component {

	static configuration (object = null) {
		if (object !== null) {
			if (typeof object === 'string') {
				return SaveScreen._configuration[object];
			} else {
				SaveScreen._configuration = Object.assign ({}, SaveScreen._configuration, object);
				SaveScreen.onUpdate ();
			}
		} else {
			return SaveScreen._configuration;
		}
	}

	static state (object = null) {
		if (object !== null) {
			if (typeof object === 'string') {
				return SaveScreen._state[object];
			} else {
				SaveScreen._state = Object.assign ({}, SaveScreen._state, object);
				SaveScreen.onUpdate ();
			}
		} else {
			return SaveScreen._state;
		}
	}

	static setup (selector) {
		$_(selector).append (SaveScreen.html ());
		return Promise.resolve ();
	}

	static bind (selector) {
		$_(`${selector} [data-screen="save"]`).on ('click', '[data-delete], [data-delete] *', function (event) {
			event.stopImmediatePropagation ();
			event.stopPropagation ();
			event.preventDefault ();

			let element = $_(this);
			if (element.matches ('path')) {
				element = element.closest ('[data-delete]');
			}

			Monogatari.global ('deleteSlot', element.data ('delete'));
			Monogatari.Storage.get (Monogatari.global ('deleteSlot')).then ((data) => {
				if (typeof data.name !== 'undefined') {
					$_(`${selector} [data-notice="slot-deletion"] small`).text (data.name);
				} else {
					$_(`${selector} [data-notice="slot-deletion"] small`).text (data.date);
				}

				$_(`${selector} [data-notice="slot-deletion"]`).addClass ('modal--active');
			});
		});

		$_(`${selector} [data-action="save"], ${selector} [data-action="save"] *`).click(function () {
			const slotName = $_(`${selector} [data-screen="save"] [data-input="slotName"]`).value ().trim ();
			if (slotName !== '') {
				Monogatari.saveTo ('SaveLabel', null, slotName).then (({ key, value }) => {
					Monogatari.addSlot (key.split ('_').pop (), value);
				});
			}
		});

		$_(`${selector} [data-action="overwrite-slot"], ${selector} [data-action="overwrite-slot"] *`).click(function () {
			const customName = $_(`${selector} [data-notice="slot-overwrite"] input`).value ().trim ();
			if (customName !== '') {
				Monogatari.saveTo ('SaveLabel', Monogatari.global ('overwriteSlot'), customName).then (({ key, value }) => {
					$_(`${selector} [data-screen='load'] [data-ui='saveSlots'] [data-ui='slots'] [data-slot='${key}'] small`).text (value.name);
					$_(`${selector} [data-screen='save'] [data-ui='slots'] [data-slot='${key}'] small`).text (value.name);
				});
				Monogatari.global ('overwriteSlot', null);
				$_(`${selector} [data-notice="slot-overwrite"]`).removeClass ('modal--active');
			}
		});

		$_(`${selector} [data-action="delete-slot"], ${selector} [data-action="delete-slot"] *`).click(function () {
			Monogatari.Storage.remove (Monogatari.global ('deleteSlot'));
			$_(`${selector} [data-slot="${Monogatari.global ('deleteSlot')}"], ${selector} [data-save="${Monogatari.global ('deleteSlot')}"]`).remove ();
			Monogatari.global ('deleteSlot', null);
			$_(`${selector} [data-notice="slot-deletion"]`).removeClass ('modal--active');
		});

		// Save to slot when a slot is pressed.
		$_(`${selector} [data-screen="save"]`).on ('click', '[data-slot], [data-slot] *:not([data-delete])', function () {
			Monogatari.global ('overwriteSlot', $_(this).parent ().data ('slot').split ('_').pop ());
			Monogatari.Storage.get (Monogatari.setting ('SaveLabel') + '_' + Monogatari.global ('overwriteSlot')).then ((data) => {
				if (typeof data.name !== 'undefined') {
					$_(`${selector} [data-notice="slot-overwrite"] input`).value (data.name);
				} else {
					$_(`${selector} [data-notice="slot-overwrite"] input`).value (data.date);
				}
				$_(`${selector} [data-notice="slot-overwrite"]`).addClass ('modal--active');
			});
		});
		return Promise.resolve ();
	}

	static init (selector) {
		// Disable the load and save slots in case Local Storage is not supported.
		if (!window.localStorage) {
			$_(`${selector} [data-screen="save"] [data-ui="slots"]`).html (`<p>${Monogatari.string ('LocalStorageWarning')}</p>`);
		}
		return Promise.resolve ();
	}

	static render () {
		$_(`${Monogatari.selector} [data-screen="save"] [data-ui="slots"]`).html ('');
		return Promise.resolve ();
	}
}

SaveScreen._configuration = {};
SaveScreen._state = {};
SaveScreen._id = 'save_screen';

SaveScreen._html = `
	<section data-component="save_screen" data-screen="save">
		<button class="fas fa-arrow-left top left" data-action="back"></button>
		<div class="horizontal horizontal--center">
			<input type="text" placeholder="Save Slot Name" data-input="slotName" required>
			<button data-string="Save" data-action="save">Save</button>
		</div>
		<div data-ui="slots" class="row row--spaced padded"></div>
	</section>
`;

Monogatari.registerComponent (SaveScreen);