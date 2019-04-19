import ScreenComponent from './../../lib/ScreenComponent';
import { Monogatari } from './../../monogatari';

class GameScreen extends ScreenComponent {

	static bind (selector) {
		this.engine.on ('click', '[data-screen="game"] *:not([data-choice])', function () {
			Monogatari.debug.debug ('Next Statement Listener');
			Monogatari.proceed ().then (() => {
				Monogatari.next ();
			}).catch (() => {
				// An action waiting for user interaction or something else
				// is blocking the game.
			});
		});

		Monogatari.registerListener ('back', {
			keys: 'left',
			callback: () => {
				Monogatari.global ('block', false);
				Monogatari.rollback ().then (() => {
					Monogatari.previous ();
				}).catch ((e) => {
					// An action waiting for user interaction or something else
					// is blocking the game.
				});
			}
		});

		return Promise.resolve ();
	}

	render () {
		return `
			<div data-content="visuals">
				<div id="particles-js" data-ui="particles"></div>
				<div id="background" data-ui="background"></div>
				<div id='components'></div>
			</div>
		`;
	}

}

GameScreen._id = 'game-screen';

Monogatari.registerComponent (GameScreen);