import { isNull, forEach } from 'lodash';
import { SourceProvider } from '@lit-dashboard/lit-dashboard';
import { addSourceProviderType } from '@lit-dashboard/lit-dashboard/app';

class PreviewProvider extends SourceProvider {

	static get typeName() {
		return 'Preview';
	}

	static get settingsDefaults() {
		return {
			sources: {}
		};
  }

	constructor(settings) {
		super();
		this.initSources = settings.sources;
		this.sources = {};
	}

	updateFromProvider(updateSource) {
		this.sources = new Proxy(this.initSources || {}, {
			get: (sources, key) => {
				return sources[key];
			},
			set: (sources, key, { value, type, name }) => {

				sources[key] = { value, type, name };

				updateSource(key, {
					value,
					type,
					name
				});

				return true;
			}
		});

		forEach(this.sources, ({ value, type, name }, key) => {
			updateSource(key, {
				value,
				type,
				name
			});
		});
	}

	updateFromDashboard(key, value) {
	
		const type = this.getType(value);

		if (isNull(type)) {
			return;
		}

		if (key in this.sources) {
			if (type === this.sources[key].type) {
				this.sources[key] = {
					...this.sources[key],
					value
				};
			}
		} else {
			this.sources[key] = {
				value,
				type,
				name: key
			}
		}
	}
}

addSourceProviderType(PreviewProvider);
