import {serviceOptions, type ServiceOption} from "@/data/catalog";
import type {Locale} from "@/i18n/routing";

type ServiceOptionCopy = {
  name: string;
  description: string;
};

const serviceCopy: Record<string, Record<Locale, ServiceOptionCopy>> = {
  dpf: {
    nl: {
      name: "DPF off / delete",
      description: "Roetfilter software-oplossing voor off-road/export waar wettelijk toegestaan."
    },
    en: {
      name: "DPF off / delete",
      description: "DPF software solution for off-road/export use where legally permitted."
    },
    pl: {
      name: "DPF off / delete",
      description: "Programowe rozwiązanie DPF do off-road/exportu tam, gdzie prawo na to pozwala."
    }
  },
  adblue: {
    nl: {
      name: "AdBlue off",
      description: "AdBlue/SCR diagnose en software-oplossing waar wettelijk toegestaan."
    },
    en: {
      name: "AdBlue off",
      description: "AdBlue/SCR diagnostics and software solution where legally permitted."
    },
    pl: {
      name: "AdBlue off",
      description: "Diagnostyka i programowe rozwiązanie AdBlue/SCR tam, gdzie prawo na to pozwala."
    }
  },
  egr: {
    nl: {
      name: "EGR off",
      description: "EGR kalibratie voor storingen, race/off-road of exporttoepassing."
    },
    en: {
      name: "EGR off",
      description: "EGR calibration for faults, race/off-road or export use."
    },
    pl: {
      name: "EGR off",
      description: "Kalibracja EGR przy usterkach, zastosowaniach race/off-road lub eksporcie."
    }
  },
  scr: {
    nl: {
      name: "SCR delete",
      description: "SCR software-oplossing na diagnose en wettelijke controle."
    },
    en: {
      name: "SCR delete",
      description: "SCR software solution after diagnostics and legal check."
    },
    pl: {
      name: "SCR delete",
      description: "Programowe rozwiązanie SCR po diagnostyce i kontroli prawnej."
    }
  },
  immo: {
    nl: {
      name: "Immo off",
      description: "Immobilizer service voor ECU-vervanging en diagnosereparatie."
    },
    en: {
      name: "Immo off",
      description: "Immobilizer service for ECU replacement and diagnostic repair."
    },
    pl: {
      name: "Immo off",
      description: "Usługa immobilizera przy wymianie ECU i naprawach diagnostycznych."
    }
  },
  "speed-limiter": {
    nl: {
      name: "Vmax / snelheidsbegrenzer",
      description: "Snelheidslimiet aanpassen na controle van aandrijving en banden."
    },
    en: {
      name: "Vmax / speed limiter",
      description: "Speed limit adjustment after drivetrain and tire suitability check."
    },
    pl: {
      name: "Vmax / limiter prędkości",
      description: "Zmiana limitu prędkości po kontroli napędu i ogumienia."
    }
  },
  launch: {
    nl: {
      name: "Launch control",
      description: "Launch-strategie voor ondersteunde ECU/TCU combinaties."
    },
    en: {
      name: "Launch control",
      description: "Launch strategy for supported ECU/TCU combinations."
    },
    pl: {
      name: "Launch control",
      description: "Strategia launch dla obsługiwanych kombinacji ECU/TCU."
    }
  },
  pops: {
    nl: {
      name: "Pops & Bangs / Crackle",
      description: "Crackle kalibratie voor benzinemotoren, conservatief ingesteld."
    },
    en: {
      name: "Pops & Bangs / Crackle",
      description: "Crackle calibration for petrol engines, configured conservatively."
    },
    pl: {
      name: "Pops & Bangs / Crackle",
      description: "Kalibracja crackle dla silników benzynowych, ustawiona zachowawczo."
    }
  },
  gearbox: {
    nl: {
      name: "DSG / TCU tuning",
      description: "Schakelstrategie, koppelbegrenzers en respons voor DSG/ZF/TCU."
    },
    en: {
      name: "DSG / TCU tuning",
      description: "Shift strategy, torque limits and response for DSG/ZF/TCU."
    },
    pl: {
      name: "DSG / TCU tuning",
      description: "Strategia zmiany biegów, limity momentu i reakcja DSG/ZF/TCU."
    }
  }
};

export function localizeServiceOption(option: ServiceOption, locale: Locale) {
  return {
    ...option,
    ...(serviceCopy[option.id]?.[locale] ?? {
      name: option.name,
      description: option.description
    })
  };
}

export function localizedServiceOptions(locale: Locale) {
  return serviceOptions.map((option) => localizeServiceOption(option, locale));
}
