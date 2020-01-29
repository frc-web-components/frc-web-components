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
			set: (sources, key, value) => {
				sources[key] = value;
				updateSource(key, value);
				return true;
			}
		});

		forEach(this.sources, (value, key) => {
			updateSource(key, value);
		});
	}

	updateFromDashboard(key, value) {
	
		const type = this.getType(value);

		if (isNull(type)) {
			return;
		}

		if (key in this.sources) {
			if (type === this.getType(this.sources[key])) {
				this.sources[key] = value;
			}
		} else {
			this.sources[key] = value;
		}
	}
}

addSourceProviderType(PreviewProvider);
