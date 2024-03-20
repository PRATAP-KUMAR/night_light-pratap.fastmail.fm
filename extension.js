const { Gio } = imports.gi;

class RunScriptWhenNightLightIsTriggered {
    enable() {
        this._systemNightLightDconf = new Gio.Settings({
            schema_id: 'org.gnome.settings-daemon.plugins.color',
        });

        this._colorSchemeDconf = new Gio.Settings({
            schema_id: 'org.gnome.desktop.interface',
        })

        this._id = this._systemNightLightDconf.connect('changed::night-light-enabled', this._runScript.bind(this));
    }

    _runScript() {
        let nightLight = this._systemNightLightDconf.get_boolean('night-light-enabled');
        let colorScheme = nightLight ? 1 : 2;
        this._colorSchemeDconf.set_enum('color-scheme', colorScheme);
    }

    disable() {
        if (this._id)
            this._systemNightLightDconf.disconnect(this._id);
        this._id = null;
        this._colorSchemeDconf = null;
        this._systemNightLightDconf = null;
    }
}

function init() {
    return new RunScriptWhenNightLightIsTriggered();
}