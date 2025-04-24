import { Store } from "vuex";
import { ComponentCustomProperties } from "vue";

import { State } from "@/interfaces/bot";

declare module "@vue/runtime-core" {
    // Declare your own store states.

    interface ComponentCustomProperties {
        $store: Store<State>;
    }
}
