<template>
  <div>
    <Tutorial>
      <Tricks>
        <Handbook>
          <slot></slot>
        </Handbook>
      </Tricks>
    </Tutorial>
  </div>
</template>

<script>
import Handbook from "./Handbook";
import Tricks from "./Tricks";
import Tutorial from "./Tutorial";

export default {
  name: "Help",
  theme: { dark: false },
  components: {
    Handbook,
    Tricks,
    Tutorial,
  },
};
</script>
