{ "rules_weather_node_to_observation_log" : {
    "LABEL" : "increment Rain Counter",
    "PLUGIN" : "reaction rule",
    "OWNER" : "rules",
    "TAGS" : [ "counter", "increment", "rain", "weather" ],
    "REQUIRES" : [ "rules" ],
    "ON" : { "node_insert--imported_weather_conditions" : { "bundle" : "imported_weather_conditions" } },
    "IF" : [
      { "NOT data_is" : {
          "data" : [ "node:field-wthr-weather" ],
          "op" : "IN",
          "value" : { "value" : [ "Rain", "rain", "thunderstorm", "Thunderstorms", "mist", "Mist" ] }
        }
      }
    ],
    "DO" : [
      { "entity_fetch" : {
          "USING" : { "type" : "node", "id" : "1" },
          "PROVIDE" : { "entity_fetched" : { "rain_counter" : "rain counter" } }
        }
      },
      { "data_convert" : {
          "USING" : { "type" : "integer", "value" : [ "rain-counter:title" ] },
          "PROVIDE" : { "conversion_result" : { "conversion_result" : "Conversion result" } }
        }
      },
      { "data_calc" : {
          "USING" : { "input_1" : [ "conversion-result" ], "op" : "+", "input_2" : "1" },
          "PROVIDE" : { "result" : { "result" : "Calculation result" } }
        }
      },
      { "data_set" : { "data" : [ "rain-counter:title" ], "value" : [ "result" ] } },
      { "entity_save" : { "data" : [ "rain-counter" ] } }
    ]
  }
}

