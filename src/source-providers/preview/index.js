import { SourceProvider, addSourceProviderType } from '@webbitjs/store';

class PreviewProvider extends SourceProvider {

	static get typeName() {
		return 'Preview';
	}

	static get settingsDefaults() {
		return {
			sources: {}
		};
  }

	constructor(providerName, settings) {
		super(providerName, settings);
		this.initSources = settings.sources;
		this.sources = {};

		this.sources = new Proxy(this.initSources || {}, {
			get: (sources, key) => {
				return sources[key];
			},
			set: (sources, key, value) => {
				sources[key] = value;
				this.updateSource(key, value);
				return true;
			}
		});

		for (let key in this.sources) {
			const value = this.sources[key];
			this.updateSource(key, value);
		}
	}

	userUpdate(key, value) {
	
		const type = this.getType(value);

		if (type === null) {
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
